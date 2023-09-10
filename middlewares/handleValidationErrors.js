export default (schema) => async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    }catch(error){
      const err = error.issues.map((e)=>({path:e.path[0], message:e.message}));
      return res.status(400).json({error: err});
    }
  };
  