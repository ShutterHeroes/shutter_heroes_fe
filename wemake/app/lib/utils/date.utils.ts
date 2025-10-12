/**
 * UTC 시간을 KST(한국 표준시, UTC+9)로 변환하는 유틸리티 함수들
 *
 * 중요: 백엔드는 모든 시간을 UTC로 저장하고 반환합니다.
 * 프론트엔드에서는 이를 KST로 변환하여 사용자에게 표시합니다.
 *
 * KST는 UTC+9이므로, UTC 시간에 9시간을 더하면 KST 시간이 됩니다.
 */

const KST_OFFSET_MS = 9 * 60 * 60 * 1000; // 9시간을 밀리초로

/**
 * UTC 날짜 문자열 또는 Date 객체를 파싱하여 Date 객체로 반환
 * @param utcDateString - UTC 날짜 문자열 또는 Date 객체
 * @returns Date 객체 (UTC 기준)
 */
function parseUtcDate(utcDateString: string | Date | null | undefined): Date | null {
  if (!utcDateString) return null;

  if (typeof utcDateString === 'string') {
    // 백엔드에서 받은 문자열이 Z로 끝나지 않으면 강제로 Z를 추가 (UTC로 해석)
    // 예: "2025-10-09T15:56:06.828356" -> "2025-10-09T15:56:06.828356Z"
    let dateString = utcDateString.trim();

    // ISO 8601 형식인지 확인하고, Z나 +/-로 끝나지 않으면 Z 추가
    if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) && !dateString.match(/[Z\+\-]$/)) {
      dateString = dateString + 'Z';
      console.log('[date.utils] Added Z to force UTC interpretation:', dateString);
    }

    const date = new Date(dateString);

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      console.error('[date.utils] Invalid date:', utcDateString);
      return null;
    }

    return date;
  }

  // Date 객체인 경우
  if (isNaN(utcDateString.getTime())) {
    console.error('[date.utils] Invalid date:', utcDateString);
    return null;
  }

  return utcDateString;
}

/**
 * UTC Date 객체를 KST Date 객체로 변환
 * @param utcDate - UTC Date 객체
 * @returns KST로 변환된 Date 객체 (실제로는 UTC+9된 시간을 가진 Date)
 */
function convertUtcToKst(utcDate: Date): Date {
  // UTC 시간에 9시간을 더함
  return new Date(utcDate.getTime() + KST_OFFSET_MS);
}

/**
 * UTC 날짜 문자열을 한국어 형식의 날짜 문자열로 변환
 * @param utcDateString - UTC 날짜 문자열
 * @param options - Intl.DateTimeFormatOptions 옵션
 * @returns 한국어 형식의 날짜 문자열
 */
export function formatToKstDate(
  utcDateString: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const utcDate = parseUtcDate(utcDateString);
  if (!utcDate) return '';

  // UTC를 KST로 변환 (UTC + 9시간)
  const kstDate = convertUtcToKst(utcDate);

  // 기본 옵션: 년, 월, 일 표시
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  try {
    // KST로 변환된 시간을 UTC로 표시 (실제로는 KST 시간이 출력됨)
    return kstDate.toLocaleDateString('ko-KR', { ...defaultOptions, ...options, timeZone: 'UTC' });
  } catch (error) {
    console.error('[date.utils] Error formatting date:', error);
    return '';
  }
}

/**
 * UTC 날짜 문자열을 한국어 형식의 날짜+시간 문자열로 변환
 * @param utcDateString - UTC 날짜 문자열
 * @param options - Intl.DateTimeFormatOptions 옵션
 * @returns 한국어 형식의 날짜+시간 문자열
 */
export function formatToKstDateTime(
  utcDateString: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const utcDate = parseUtcDate(utcDateString);
  if (!utcDate) return '';

  // UTC를 KST로 변환 (UTC + 9시간)
  const kstDate = convertUtcToKst(utcDate);

  // 기본 옵션: 년, 월, 일, 시, 분 표시
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  try {
    // KST로 변환된 시간을 UTC로 표시 (실제로는 KST 시간이 출력됨)
    return kstDate.toLocaleString('ko-KR', { ...defaultOptions, ...options, timeZone: 'UTC' });
  } catch (error) {
    console.error('[date.utils] Error formatting datetime:', error);
    return '';
  }
}

/**
 * UTC 날짜 문자열을 한국어 형식의 짧은 날짜 문자열로 변환
 * 예: "2025. 10. 9."
 */
export function formatToKstShortDate(utcDateString: string | Date | null | undefined): string {
  return formatToKstDate(utcDateString, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
}

/**
 * UTC 날짜 문자열을 한국어 형식의 긴 날짜+시간 문자열로 변환
 * 예: "2025년 10월 9일 (수) 오후 3:30"
 */
export function formatToKstLongDateTime(utcDateString: string | Date | null | undefined): string {
  return formatToKstDateTime(utcDateString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * UTC Date 객체를 KST Date 객체로 변환 (datetime-local input용)
 * @param utcDate - UTC Date 객체
 * @returns KST로 변환된 Date 객체
 */
export function utcToKstDate(utcDate: Date | string | null | undefined): Date | null {
  const date = parseUtcDate(utcDate);
  if (!date) return null;

  // UTC를 KST로 변환
  return convertUtcToKst(date);
}

/**
 * KST Date 객체를 UTC Date 객체로 변환 (서버 전송용)
 * @param kstDate - KST Date 객체
 * @returns UTC로 변환된 Date 객체
 */
export function kstToUtcDate(kstDate: Date | string | null | undefined): Date | null {
  const date = parseUtcDate(kstDate);
  if (!date) return null;

  // KST 시간에서 9시간을 뺌 (UTC로 변환)
  return new Date(date.getTime() - KST_OFFSET_MS);
}
