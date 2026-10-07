export default function BadRequest(message, code = 'BAD_REQUEST') {
    this.message = message;
    this.code = code;
    this.name = 'BadRequest';
    this.statusCode = 400;
}
