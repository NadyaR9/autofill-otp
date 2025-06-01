import React, { useEffect, useRef, useState } from 'react';

interface OTPInputProps {
  length: number;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  pattern?: string;
  hasError?: boolean;
  resetError?: () => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length,
  onChange,
  onComplete,
  pattern,
  hasError,
  resetError,
}) => {
  const [values, setValues] = useState<string[]>(() => Array(length).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstInput = containerRef.current?.querySelector<HTMLInputElement>('input');
    firstInput?.focus();
  }, []);

  useEffect(() => {
    if (hasError) {
      const empty = Array(length).fill('');
      setValues(empty);
      onChange?.('');
      setTimeout(() => inputsRef.current[0]?.focus(), 0);
    }
  }, [hasError, length, onChange]);

  //Web OTP API для автоматического считывания кода из SMS
  useEffect(() => {
    // Проверяем поддержку Web OTP
    if (!navigator.credentials || !('OTPCredential' in window)) {
      console.log('Web OTP не поддерживается в этом браузере');
      return;
    } else {
      console.log('Web OTP поддерживается в этом браузере');
    }

    // Найдём наш инпут с autocomplete
    const input = containerRef.current?.querySelector<HTMLInputElement>(
      'input[autocomplete="one-time-code"]'
    );
    console.log('input', input);

    if (!input) {
      console.warn('Не найден один единственный input[autocomplete="one-time-code"]');
      return;
    }

    // Создаём контроллер, чтобы отменить ожидание при unmount или submit
    const controller = new AbortController();

    console.log('controller', controller);

    try {
      console.log('navigator.credentials', navigator.credentials);
      // Сразу вызываем Web OTP API
      navigator.credentials
        .get({
          otp: { transport: ['sms'] },
          signal: controller.signal,
        })
        .then((cred: OTPCredential) => {
          console.log('cred', cred);
          distributeCode(cred.code);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
          } else {
            console.error('catch error:', err);
          }
        });
    } catch (error) {
      console.log('error', error);
    }

//   Очистка
  return () => {
    controller.abort();
  };
  }, [length]);

  // Вызов callbacks при изменении массива
  useEffect(() => {
    onChange?.(values.join(''));
    if (values.every((d) => d !== '')) {
      if (!hasError) {
        onComplete?.(values.join(''));
      }
    }
  }, [values, onChange, onComplete]);

  // Обработка ввода одного символа
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;
    const newValues = [...values];
    newValues[idx] = val;
    setValues(newValues);
    if (val && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
    if (hasError && val && resetError) resetError();
  };

  // Обработка навигации стрелками и обратного стирания
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      e.preventDefault();
      inputsRef.current[idx + 1]?.focus();
    } else if (e.key === 'Backspace' && values[idx] === '' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  // Обработка paste полной строки кода
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    console.log('handlePaste', e);
    e.preventDefault();
    const pasteData = e.clipboardData.getData('Text').trim();
    const digits = pasteData
      .split('')
      .filter((ch) => /[0-9]/.test(ch))
      .slice(0, length);
    while (digits.length < length) digits.push('');
    setValues(digits);
    const firstEmpty = digits.findIndex((d) => d === '');
    const focusIdx = firstEmpty === -1 ? length - 1 : firstEmpty;
    inputsRef.current[focusIdx]?.focus();
  };

  // Фокус и блюр для класса is-focused
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    containerRef.current
      ?.querySelectorAll<HTMLInputElement>('input')
      .forEach((inp) => inp.classList.remove('is-focused'));
    e.currentTarget.classList.add('is-focused');
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.classList.remove('is-focused');
  };

  /**
   * Разбивает полный OTP-код на массив символов нужной длины
   * и обновляет state с фокусом на первом пустом поле.
   */
  const distributeCode = (code: string) => {
    console.log('distributeCode', code);
    const digits = code
      .split('')
      .filter((ch) => /^[0-9]$/.test(ch))
      .slice(0, length);

    setValues(digits);

    const firstEmpty = digits.findIndex((d) => d === '');
    const focusIdx = firstEmpty === -1 ? length - 1 : firstEmpty;
    inputsRef.current[focusIdx]?.focus();

    onChange?.(digits.join(''));
    if (digits.every((d) => d !== '')) {
      onComplete?.(digits.join(''));
    }
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', gap: '8px' }}>
      {values.map((digit, idx) => (
        <input
        style={{ width: '48px', height: '48px' }}
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={idx === 0 ? length : 1}
          pattern={pattern}
          value={digit}
          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
          onInput={(e) => {
            console.log('onInput', e);
            if (idx === 0) {
              distributeCode((e.target as HTMLInputElement).value);
            }
          }}
          onPaste={idx === 0 ? handlePaste : undefined}
          onChange={(e) => {
            console.log('onChange', e);
            const val = (e.target as HTMLInputElement).value;
            if (idx === 0 && val.length > 1) {
              distributeCode(val);
            } else {
              handleChange(e, idx);
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ))}
    </div>
  );
};
