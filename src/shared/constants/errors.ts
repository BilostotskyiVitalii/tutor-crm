export const firebaseErrorMap: Record<string, string> = {
  // Auth ошибки
  'auth/invalid-email': 'Неверный формат email',
  'auth/user-not-found': 'Пользователь не найден',
  'auth/wrong-password': 'Неправильный пароль',
  'auth/user-disabled': 'Пользователь заблокирован',
  'auth/too-many-requests': 'Слишком много попыток, попробуйте позже',
  'auth/invalid-credential': 'Неверные данные для входа',
  'auth/email-already-in-use': 'Этот email уже зарегистрирован',
  'auth/weak-password': 'Пароль слишком простой',
  'auth/operation-not-allowed': 'Этот метод аутентификации отключен',
  'auth/requires-recent-login': 'Для этой операции нужен недавний вход',

  // Realtime Database ошибки
  'permission-denied': 'Нет доступа к базе данных',
  'network-request-failed': 'Проблемы с сетью, попробуйте позже',

  // Firestore ошибки
  unavailable: 'Сервис временно недоступен, попробуйте позже',
  'deadline-exceeded': 'Превышено время ожидания запроса',
  'already-exists': 'Запись уже существует',
  'not-found': 'Запись не найдена',
  'resource-exhausted': 'Превышены лимиты запросов',
  'failed-precondition':
    'Невозможно выполнить операцию из-за состояния ресурса',

  // Storage ошибки
  'storage/object-not-found': 'Файл не найден',
  'storage/unauthorized': 'Нет прав на доступ к файлу',
  'storage/canceled': 'Операция отменена',
  'storage/unknown': 'Неизвестная ошибка хранения',
};
