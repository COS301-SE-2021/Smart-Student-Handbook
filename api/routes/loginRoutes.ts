const express: any = require( 'express' );
const router: any = express.Router();

router.get('/', (req: any, res: any) =>
{
	res.status(200).json({ message: 'API WORKING!' });
});

module.exports = router;