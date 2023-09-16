import { __dirname } from './utils.js'
import multer from 'multer'

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const folderName = file.mimetype === 'application/pdf' ? 'documents' : 'profile'
		cb(null, `${__dirname}/../public/img/${folderName}`)
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	}
})

const uploader = multer({ storage })

export default uploader