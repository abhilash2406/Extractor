export default function Forbidden(message) {
    this.message = message;
    this.code = 403;
    this.name = 'Forbidden';
    this.statusCode = 403;
}
