import MainRouter from "./Router.js";

class ViewsRouter extends MainRouter {
    init() {
        this.get(
            '/',
            ['PUBLIC'],
            async (req, res, next) => {
                try {
                    return res.render(
                        'index',
                        {
                            title: 'DecorateMe'
                        }
                    )
                } catch (error) {
                    next(error);
                }
            }
        )
    }
}

export default new ViewsRouter()