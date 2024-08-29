export default (e, req, res)=>{
    console.log(e);
	const {errors} = e;
	if(errors)
		return res.status(400).json({"errors":errors.map(err => err.message)});
	return res.status(500).json({"errors":['Error interno na API']});
}