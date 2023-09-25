import { __dirname } from './utils.js'
import multer from 'multer'

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const folderName = 
			file.fieldname === 'photo' 
				? 'profile' 
				: file.fieldname === 'thumbnail' 
					? 'products' 
					: 'documents'
		cb(null, `${__dirname}/../public/img/${folderName}`)
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	}
})

const uploader = multer({ storage })

export default uploader