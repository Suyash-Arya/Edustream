import multer from "multer";

// This stores the file in memory buffer instead of writing to disk
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
export default upload;
