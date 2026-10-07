export default function Unauthorized(message) {
    this.message = message;
    this.code = 401;
    this.name = 'Unauthorized';
    this.statusCode = 401;
}
