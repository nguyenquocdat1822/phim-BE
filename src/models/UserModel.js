const mongoose = require("mongoose");

const filmFavoriteSchema = new mongoose.Schema({
  slug: { type: String },
  filmName: { type: String },
  filmName_origin: { type: String },
  poster_url: { type: String },
  thumb_url: { type: String },
  type: { type: String },
});

const filmSchema = new mongoose.Schema({
  slug: { type: String },
  filmName: { type: String },
  filmName_origin: { type: String },
  poster_url: { type: String },
  thumb_url: { type: String },
  filmEp: { type: Number },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  displayName: { type: String, required: true },
  filmHistory: [filmSchema],
  filmsFavorite: [filmFavoriteSchema],
});

// Middleware to limit the filmHistory to 3 films
userSchema.pre("save", function (next) {
  // Lọc những bộ phim null trong filmsFavorite
  this.filmsFavorite = this.filmsFavorite.filter((film) => film != null);

  // Giới hạn số lượng phim yêu thích tối đa là 3
  if (this.filmsFavorite.length > 3) {
    this.filmsFavorite = this.filmsFavorite.slice(this.filmsFavorite.length - 3);
  }

  this.filmHistory = this.filmHistory.filter((film) => film != null);

  if (this.filmHistory.length > 3) {
    this.filmHistory = this.filmHistory.slice(this.filmHistory.length - 3);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// userSchema.pre("save", function (next) {
// Đây là cách khai báo middleware pre-save của Mongoose. Middleware này sẽ chạy trước khi một tài liệu User được lưu vào cơ sở dữ liệu.
// pre("save") nghĩa là middleware này sẽ được kích hoạt trước khi thực hiện thao tác save (lưu) trên một tài liệu.
// function (next) là hàm callback được gọi khi middleware này chạy. Hàm này nhận một tham số next, là hàm cần gọi để tiếp tục quá trình lưu tài liệu.
// if (this.filmHistory.length > 3) {:

// this ở đây đại diện cho tài liệu User hiện tại đang được lưu.
// this.filmHistory.length là độ dài của mảng filmHistory.
// Điều kiện if (this.filmHistory.length > 3) kiểm tra xem danh sách phim hiện tại có nhiều hơn 3 phim hay không.
// this.filmHistory = this.filmHistory.slice(this.filmHistory.length - 3);:

// Nếu filmHistory có nhiều hơn 3 phim, dòng mã này sẽ giữ lại 3 phim mới nhất và loại bỏ các phim cũ hơn.
// this.filmHistory.slice(this.filmHistory.length - 3):
// slice là một phương thức của mảng trong JavaScript. Nó tạo ra một bản sao của một phần của mảng gốc.
// this.filmHistory.length - 3 xác định vị trí bắt đầu của phần tử thứ 3 từ cuối cùng của mảng.
// Do đó, this.filmHistory.slice(this.filmHistory.length - 3) sẽ lấy 3 phần tử cuối cùng của mảng filmHistory.
// next();
// Gọi hàm next() để tiếp tục quá trình lưu tài liệu. Nếu không gọi next(), quá trình lưu sẽ bị dừng lại tại middleware này.
