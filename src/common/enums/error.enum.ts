export enum ERROR {
  EMAIL_EXISTS = 'This email address is already registered with an existing user!',
  USERNAME_EXISTS = 'This username is already registered with an existing user!',
  USER_NOT_CREATED = 'There was a problem creating the user account, please try again later.',
  EMAIL_DOES_NOT_EXIST = 'No user with the supplied email exists on this platform.',
  OTP_HAS_EXPIRED = 'The OTP has expired.',
  INVALID_OTP = 'Invalid OTP supplied.',
  VERIFICATION_TOKEN_EXPIRED = 'The supplied verification token has expired.',
  INVALID_TOKEN = 'Invalid verification token supplied',
  USER_ALREADY_VERIFIED = 'This user has already been verified!',
  USER_NOT_VERIFIED = 'This account has not been verified! Verify the account to proceed.',
  USER_DOES_NOT_EXIST = 'No user with the supplied credentials exists on this platform.',
  INVALID_EMAIL_ADDRESS = 'Invalid email address.',
  INCORRECT_PASSWORD = 'Incorrect password.',
  COULD_NOT_FETCH = 'There was a problem fetching the required data.',
  DATABASE_ERROR = 'Database Error.',
  INVALID_FILE_TYPE = 'Invalid file type.',
  CORRUPT_FILE = 'Cannot upload corrupt file.',
  FILE_UPLOAD_FAILED = 'File upload failed.',
}