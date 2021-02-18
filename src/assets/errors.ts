export default {
  incognitoError:
    'Lo sentimos, ha ocurrido un error, porfavor intente de nuevo o en su defecto más tarde.',
  emptyField: 'Porfavor rellene correctamente todos los campos.',
  invalidCredentials: 'El correo y/o contraseña ingresados con incorrectos.',
  invalidField: (field: string) => `El campo ${field} ingresado es inválido.`,
  emailInUse: 'El correo electronico ingresado ya está utilizado por otro usuario.',
  invalidSimbols: (field?: string) =>
    field
      ? `El campo ingresado ${field} contiene simbolos no permitidos.`
      : `Por favor no ingrese simbolos no permitidos.`,
};
