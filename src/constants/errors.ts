export const firebaseErrorMap: Record<string, string> = {
  // Auth ошибки
  'auth/invalid-email': 'Неверный формат email',
  'auth/user-not-found': 'Пользователь не найден',
  'auth/wrong-password': 'Неправильный пароль',
  'auth/user-disabled': 'Пользователь заблокирован',
  'auth/too-many-requests': 'Слишком много попыток, попробуйте позже',
  'auth/invalid-credential': 'Неверные данные для входа',
  // Realtime Database ошибки
  'permission-denied': 'Нет доступа к базе данных',
  'network-request-failed': 'Проблемы с сетью, попробуйте позже',
};
