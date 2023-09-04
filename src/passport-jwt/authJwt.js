export default role => {
    return async (req, res, next)=>{
        if(!req.user) return res.status(401).json({ success: false, error: 'Unauthorized'})
        if(req.user.role !== role && req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Not allowed'})
        next()
    }
}