import fs from "fs";
import CustomError from "./error/CustomError.js";
import EErrors from "./error/enum.js";

export default path => {
	try {
		fs.unlinkSync(path)
		return true
	} catch (error) {
		CustomError.createError({
			name: "Delete file error",
			cause: "No such file or directory",
			message: "Error deleting file",
			code: EErrors.DATABASE_ERROR
		})
	}
}