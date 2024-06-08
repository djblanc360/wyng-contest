// determine where a function is accessed from
function accessedDirectly(req, res, next) {
    req.isAccessedDirectly = true
    next()
}

export { accessedDirectly }