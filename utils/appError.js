class AppError extends Error {
    constructor(message, statusCode) {
        // super gọi constructor lớp cha
        super(message); // Gọi constructor của Error, truyền message vào
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
        // Fail - lỗi từ phía client, Error - lỗi từ phía server
        this.isOperational = true;

        // ghi lại chính xác ngăn xếp lỗi
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
