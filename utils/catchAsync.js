// Catch Async => dùng thay thế cho try-catch
// xuất ra hàm nhận tham số fn
// module.exports =
//     (fn) =>
//         // fn là hàm bất đồng bộ bạn truyền vào catchAsync
        // (
        //     req,
        //     res,
        //     next, // next là hàm callback để chuyển quyền điều khiển sang middleware kế tiếp trong chuỗi xử lý request.
            // eslint-disable-next-line prettier/prettier
        // ) => fn(req, res, next).catch(next) // nếu fn gây lỗi, .catch(next) sẽ tự động gửi lỗi về middleware xử lý lỗi của Express.

// catch.next bắt lỗi promise và gọi next(err)
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};