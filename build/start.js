/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./start.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.ts":
/*!****************!*\
  !*** ./app.ts ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst dotenv = __webpack_require__(/*! dotenv */ \"dotenv\");\nconst cookieParser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\nconst morgan = __webpack_require__(/*! morgan */ \"morgan\");\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nconst cors = __webpack_require__(/*! cors */ \"cors\");\nconst multer = __webpack_require__(/*! multer */ \"multer\");\nconst compression = __webpack_require__(/*! compression */ \"compression\");\nconst express = __webpack_require__(/*! express */ \"express\");\nconst cluster = __webpack_require__(/*! cluster */ \"cluster\");\nconst db_connection_1 = __webpack_require__(/*! ./src/db/db.connection */ \"./src/db/db.connection.ts\");\nconst core_1 = __webpack_require__(/*! @overnightjs/core */ \"@overnightjs/core\");\nconst logger_1 = __webpack_require__(/*! @overnightjs/logger */ \"@overnightjs/logger\");\nconst authentication_controller_1 = __webpack_require__(/*! ./src/controllers/authentication/authentication.controller */ \"./src/controllers/authentication/authentication.controller.ts\");\nconst repo_controller_1 = __webpack_require__(/*! ./src/controllers/coolshare/repo.controller */ \"./src/controllers/coolshare/repo.controller.ts\");\nconst kitchen_controller_1 = __webpack_require__(/*! ./src/controllers/mindful-meals/kitchen.controller */ \"./src/controllers/mindful-meals/kitchen.controller.ts\");\nconst account_controller_1 = __webpack_require__(/*! ./src/controllers/account/account.controller */ \"./src/controllers/account/account.controller.ts\");\nconst notifications_controller_1 = __webpack_require__(/*! ./src/controllers/notifications/notifications.controller */ \"./src/controllers/notifications/notifications.controller.ts\");\nclass PortfolioServer extends core_1.Server {\n    get server() {\n        return this.app;\n    }\n    constructor() {\n        super(\"development\" === 'development');\n        if (cluster.isMaster) { // && process.env.NODE_ENV === 'production'\n            cluster.fork();\n            cluster.fork();\n            cluster.fork();\n            cluster.fork();\n        }\n        else {\n            this.start();\n            this.initializeMiddleware();\n            this.setupControllers();\n        }\n    }\n    initializeMiddleware() {\n        dotenv.config();\n        const storage = multer.diskStorage({\n            destination: (req, file, callback) => callback(null, './uploads'),\n            filename: (req, file, callback) => callback(null, file.originalname)\n        });\n        const upload = multer({ storage: storage });\n        this.app.use(compression());\n        this.app.use(express.static('thumbnails'));\n        this.app.disable('x-powered-by');\n        this.app.use(bodyParser.json());\n        this.app.use(bodyParser.urlencoded({ extended: true }));\n        this.app.use(cors({\n            origin: [\n                'http://localhost:4200',\n                'http://www.gunner-madsen.com',\n                'https://gunner-madsen.com',\n                'https://coolshare.herokuapp.com',\n                'https://www.shareily.com',\n                'https://mindfulmeals.herokuapp.com'\n            ],\n            methods: ['POST', 'PUT', 'OPTIONS', 'DELETE', 'GET', 'PATCH'],\n            allowedHeaders: ['Origin, X-Requested-With, Accept-Encoding, Content-Disposition, Content-Type, Accept, Authorization, X-XSRF-TOKEN'],\n            credentials: true\n        }));\n        this.app.use(upload.any());\n        this.app.use(morgan('dev'));\n        this.app.use(cookieParser());\n        this.app.use((error, request, response, next) => {\n            response.locals.message = error.message;\n            response.locals.error = request.app.get('env') === 'development' ? error : {};\n            response.status(500).json({ message: error });\n        });\n    }\n    setupControllers() {\n        new db_connection_1.Database();\n        const userController = new authentication_controller_1.UserController();\n        const repoController = new repo_controller_1.RepositoryController();\n        const kitchenController = new kitchen_controller_1.KitchenController();\n        const accountController = new account_controller_1.AccountController();\n        const notificationController = new notifications_controller_1.NotificationController();\n        super.addControllers([userController, repoController, kitchenController, accountController, notificationController]);\n    }\n    start() {\n        let listenPort = process.env.PORT || 3000;\n        this.app.listen(listenPort, () => {\n            logger_1.Logger.Info(`Portfolioapis listening on port ${listenPort}`);\n        });\n    }\n}\nexports.PortfolioServer = PortfolioServer;\n\n\n//# sourceURL=webpack:///./app.ts?");

/***/ }),

/***/ "./src/controllers/account/account.controller.ts":
/*!*******************************************************!*\
  !*** ./src/controllers/account/account.controller.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst core_1 = __webpack_require__(/*! @overnightjs/core */ \"@overnightjs/core\");\nconst jwt_interceptor_1 = __webpack_require__(/*! ../../middleware/jwt.interceptor */ \"./src/middleware/jwt.interceptor.ts\");\nconst authentication_model_1 = __webpack_require__(/*! ../../models/authentication.model */ \"./src/models/authentication.model.ts\");\nconst user_images_model_1 = __webpack_require__(/*! ../../models/user-images.model */ \"./src/models/user-images.model.ts\");\nconst userModel = new authentication_model_1.User().getModelForClass(authentication_model_1.User);\nconst userImagesModel = new user_images_model_1.UserImagesModel().getModelForClass(user_images_model_1.UserImagesModel);\nlet AccountController = class AccountController {\n    getAccountInfoByToken(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                let user = yield userModel.findById({ _id: response['user']._id });\n                let picture = yield userImagesModel.findById({ _id: response['user']._id });\n                if (user) {\n                    // let image = Buffer.from(picture.ProfilePicture);\n                    let account = {\n                        Id: user._id,\n                        UserName: user.UserName,\n                        Email: user.Email,\n                        ProfilePicture: picture,\n                        FirstName: user.FirstName,\n                        LastName: user.LastName,\n                    };\n                    return response.status(200).json({ account: account });\n                }\n            }\n            catch (error) {\n                return response.status(500).json({ error: error });\n            }\n        });\n    }\n    saveAccountPicture(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const base64Image = Buffer.from(request.body.picture);\n                const user = yield userImagesModel.findByIdAndUpdate({ _id: response['user']._id }, base64Image);\n                if (user) {\n                    return response.status(200).json({ message: \"Your picture was saved successfully\" });\n                }\n                else {\n                    return response.status(400).json({ message: \"An error occured when trying to save your profile picture\" });\n                }\n            }\n            catch (_a) {\n                return response.status(500).json({ message: \"An error occured while trying to save your profile picture\" });\n            }\n        });\n    }\n    updateProfileInfo(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const account = request.body;\n            const user = yield userModel.findById({ _id: request.params.id });\n            if (!account && !user) {\n                return response.status(400).json({ message: \"Profile information not found\" });\n            }\n            try {\n                const result = yield userModel.update({ _id: request.params.id }, { $set: Object.assign(Object.assign({}, account), { EditedOn: new Date() }) });\n                if (result) {\n                    return response.status(201).json({ message: \"Your profile was updated successfully\" });\n                }\n                else {\n                    return response.status(500);\n                }\n            }\n            catch (error) {\n                return response.status(500).json({ error: error });\n            }\n        });\n    }\n};\n__decorate([\n    core_1.Get(''),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AccountController.prototype, \"getAccountInfoByToken\", null);\n__decorate([\n    core_1.Post('picture'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AccountController.prototype, \"saveAccountPicture\", null);\n__decorate([\n    core_1.Put(':id'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AccountController.prototype, \"updateProfileInfo\", null);\nAccountController = __decorate([\n    core_1.Controller('api/account'),\n    core_1.ClassMiddleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken)\n], AccountController);\nexports.AccountController = AccountController;\n\n\n//# sourceURL=webpack:///./src/controllers/account/account.controller.ts?");

/***/ }),

/***/ "./src/controllers/authentication/authentication.controller.ts":
/*!*********************************************************************!*\
  !*** ./src/controllers/authentication/authentication.controller.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __rest = (this && this.__rest) || function (s, e) {\n    var t = {};\n    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)\n        t[p] = s[p];\n    if (s != null && typeof Object.getOwnPropertySymbols === \"function\")\n        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {\n            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))\n                t[p[i]] = s[p[i]];\n        }\n    return t;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst authentication_model_1 = __webpack_require__(/*! ../../models/authentication.model */ \"./src/models/authentication.model.ts\");\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst cmd = __webpack_require__(/*! node-cmd */ \"node-cmd\");\nconst jwt_interceptor_1 = __webpack_require__(/*! ../../middleware/jwt.interceptor */ \"./src/middleware/jwt.interceptor.ts\");\n// import { OK, BAD_REQUEST } from 'http-status-codes';\nconst core_1 = __webpack_require__(/*! @overnightjs/core */ \"@overnightjs/core\");\nconst notifications_model_1 = __webpack_require__(/*! ../../models/notifications.model */ \"./src/models/notifications.model.ts\");\nconst UserModel = new authentication_model_1.User().getModelForClass(authentication_model_1.User);\nconst notificationModel = new notifications_model_1.Notifications().getModelForClass(notifications_model_1.Notifications);\nlet UserController = class UserController {\n    login(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const userName = request.body.UserName;\n            const password = request.body.Password;\n            const user = yield UserModel.findOne({ UserName: userName });\n            try {\n                if (user) {\n                    const hash = user.validatePassword(password);\n                    if (user.Hash === hash && user.UserName === userName) {\n                        const _a = user.toObject(), { hash } = _a, userWithoutHash = __rest(_a, [\"hash\"]);\n                        const token = yield user.generateSessionToken().catch(error => { throw `Unable to get token: ${error || null}`; });\n                        const csrfToken = yield user.generateCsrfToken();\n                        response.cookie(\"SESSIONID\", token, { maxAge: 3600000, httpOnly: true, secure: false });\n                        response.cookie(\"XSRF-TOKEN\", csrfToken);\n                        let result = {\n                            JWTToken: token,\n                            CSRFToken: csrfToken,\n                            Id: user.id\n                        };\n                        return response.status(200).json(result);\n                    }\n                    else {\n                        return response.status(400).json({\n                            message: \"Your username or password is incorrect\"\n                        });\n                    }\n                }\n                else {\n                    return response.status(400).json({\n                        message: \"Your username or password is incorrect.\"\n                    });\n                }\n            }\n            catch (error) {\n                return response.status(500).json({ message: \"An error occured when processing your request\", error: error });\n            }\n        });\n    }\n    register(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const userName = request.body.UserName;\n            const email = request.body.Email;\n            const password = request.body.Password;\n            if (!userName || !email || !password) {\n                return response.status(400).json({ message: \"A username, email and password are required to create an account\" });\n            }\n            try {\n                const duplicate = yield UserModel.find({\n                    $or: [\n                        { UserName: userName },\n                        { Email: email }\n                    ]\n                });\n                if (duplicate.length) {\n                    return response.status(400).json({\n                        message: `The username or email you provided is already taken`\n                    });\n                }\n                const user = new UserModel();\n                user.UserName = userName;\n                user.Email = email;\n                user.FirstName = null;\n                user.LastName = null;\n                user.CreatedOn = new Date();\n                user.EditedOn = new Date();\n                user.ProfilePicture = null;\n                user.Hash = user.setPassword(password);\n                const result = yield UserModel.create(user);\n                if (result) {\n                    const cwd = path.join(__dirname, '..', 'coolshare', 'repository');\n                    const directory = path.join(cwd, user.id);\n                    const file = path.join(cwd, 'Getting Started.pdf').replace(/(\\s+)/g, '\\\\$1');\n                    const userNotificationModel = {\n                        Notifications: [],\n                        UserId: result._id,\n                        NotificationBadgeHidden: true\n                    };\n                    const notification = yield notificationModel.create(userNotificationModel);\n                    fs.mkdirSync(directory, 0o755);\n                    fs.mkdirSync(`thumbnails/${user.id}`);\n                    cmd.run(`cp -r ${file} ${directory}`);\n                    cmd.run(`cp thumbnails/\"Getting Started.png\" thumbnails/${user.id}`);\n                    response.status(200).json({ message: \"Your account has been created successfully\" });\n                }\n            }\n            catch (error) {\n                return response.status(500).json({\n                    message: `An error occured ${error}`\n                });\n            }\n        });\n    }\n    logout(request, response) {\n        response.clearCookie(\"SESSIONID\");\n        response.clearCookie(\"XSRF-TOKEN\");\n        return response.status(200).json({ message: 'Logout Successful' });\n    }\n    getAll(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const user = yield UserModel.find({}).select('-hash');\n                return response.status(200).json(Object.assign({}, user));\n            }\n            catch (error) {\n                return response.status(500).end();\n            }\n        });\n    }\n    getById(request, response, id) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const user = yield UserModel.findById(id).select('-hash');\n                return response.status(200).json(Object.assign({}, user));\n            }\n            catch (error) {\n                return response.status(500).end();\n            }\n        });\n    }\n    update(request, response, id, userParams) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const user = yield UserModel.findById(id);\n                if (!user)\n                    throw 'User not found';\n                if (user.UserName !== userParams.UserName && (yield UserModel.findOne({ UserName: userParams.UserName }))) {\n                    throw +userParams.UserName + ' is already taken';\n                }\n                if (userParams.password) {\n                    userParams.hash = bcrypt.hashSync(userParams.password, 10);\n                }\n                Object.assign(user, userParams);\n                yield user.save();\n                return response.status(200).end();\n            }\n            catch (error) {\n                return response.status(500).end();\n            }\n        });\n    }\n    delete(request, response, id) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const result = yield UserModel.findByIdAndRemove(id);\n                if (result) {\n                    return response.status(200).end();\n                }\n            }\n            catch (error) {\n                return response.status(500).end();\n            }\n        });\n    }\n};\n__decorate([\n    core_1.Post('login'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], UserController.prototype, \"login\", null);\n__decorate([\n    core_1.Post('register'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], UserController.prototype, \"register\", null);\n__decorate([\n    core_1.Get('logout'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Object)\n], UserController.prototype, \"logout\", null);\n__decorate([\n    core_1.Get(''),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], UserController.prototype, \"getAll\", null);\n__decorate([\n    core_1.Get(':id'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object, String]),\n    __metadata(\"design:returntype\", Promise)\n], UserController.prototype, \"getById\", null);\n__decorate([\n    core_1.Put(':id'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object, String, Object]),\n    __metadata(\"design:returntype\", Promise)\n], UserController.prototype, \"update\", null);\n__decorate([\n    core_1.Delete('delete/:id'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object, String]),\n    __metadata(\"design:returntype\", Promise)\n], UserController.prototype, \"delete\", null);\nUserController = __decorate([\n    core_1.Controller('api/users')\n], UserController);\nexports.UserController = UserController;\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./src/controllers/authentication/authentication.controller.ts?");

/***/ }),

/***/ "./src/controllers/coolshare/repo.controller.ts":
/*!******************************************************!*\
  !*** ./src/controllers/coolshare/repo.controller.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst cmd = __webpack_require__(/*! node-cmd */ \"node-cmd\");\nconst fs = __webpack_require__(/*! fs-extra */ \"fs-extra\");\nconst nodefs = __webpack_require__(/*! fs */ \"fs\");\nconst async = __webpack_require__(/*! async */ \"async\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst mime = __webpack_require__(/*! mime */ \"mime\");\nconst uuid = __webpack_require__(/*! uuid */ \"uuid\");\nconst quicklookThumbnail = __webpack_require__(/*! quicklook-thumbnail */ \"quicklook-thumbnail\");\nconst prettyIcon = __webpack_require__(/*! pretty-file-icons */ \"pretty-file-icons\");\nconst convert_svg_to_png_1 = __webpack_require__(/*! convert-svg-to-png */ \"convert-svg-to-png\");\nconst express_1 = __webpack_require__(/*! express */ \"express\");\n// import { Thumbnail } from 'thumbnail'\nconst Thumbnail = __webpack_require__(/*! thumbnail */ \"thumbnail\");\nconst core_1 = __webpack_require__(/*! @overnightjs/core */ \"@overnightjs/core\");\nconst jwt_interceptor_1 = __webpack_require__(/*! ../../middleware/jwt.interceptor */ \"./src/middleware/jwt.interceptor.ts\");\nconst shared_folder_model_1 = __webpack_require__(/*! ../../models/shared-folder.model */ \"./src/models/shared-folder.model.ts\");\nconst files_model_1 = __webpack_require__(/*! ../../models/files.model */ \"./src/models/files.model.ts\");\nconst entity_type_1 = __webpack_require__(/*! ../../models/entity.type */ \"./src/models/entity.type.ts\");\nconst sharedFolderModel = new shared_folder_model_1.SharedFolders().getModelForClass(shared_folder_model_1.SharedFolders);\nconst filesModel = new files_model_1.Files().getModelForClass(files_model_1.Files);\nlet RepositoryController = \n// @ClassMiddleware(JwtInterceptor.checkJWTToken)\nclass RepositoryController {\n    getRepository(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const { id, path } = request.query;\n            if (!id && !path)\n                return response.status(400).end();\n            try {\n                const entities = yield filesModel.find({ UserId: id });\n                const result = {\n                    result: entities[0].Files.length ? entities[0].Files : [{ Name: \"No contents to display\" }],\n                    settings: {\n                        isEmpty: entities[0].Files.length ? true : false,\n                        cwd: path\n                    }\n                };\n                return response.status(200).json(result);\n            }\n            catch (error) {\n                return response.status(500).json(error);\n            }\n        });\n    }\n    createNewFolder(request, response) {\n        const userId = response['user']._id;\n        const folderData = request.body.data;\n        const cwd = path.join(__dirname, 'repository', userId, request.body.path, folderData.FolderName);\n        let metadata = folderData.Accessibility === 1 ? { invitees: folderData.Invitees, owner: folderData.FolderName } : null;\n        if (fs.existsSync(cwd)) {\n            return response.status(409).json({ message: \"This folder name already exists\" });\n        }\n        fs.mkdir(cwd, 0o755, (error) => {\n            if (error) {\n                return response.status(500).end();\n            }\n            else {\n                const entity = {\n                    originalName: folderData.FolderName,\n                    cwd: request.body.path,\n                    path: path.join(request.body.path, folderData.FolderName),\n                    id: userId,\n                    absPath: cwd,\n                    type: entity_type_1.EntityTypes.Folder,\n                    meta: metadata,\n                    icon: `/${folderData.Accessibility === 1 ? 'shared-folder' : 'folder'}.png`\n                };\n                this.createEntity(entity);\n                return response.status(204).end();\n                // this.getContentsOfFolder(request, response)\n            }\n        });\n    }\n    uploadFile(request, response) {\n        if (!request.files[0]) {\n            return response.status(404).json({ message: \"No Files were present during upload\" });\n        }\n        async.parallel([\n            (callback) => {\n                const uploads = path.resolve(request.files[0].path);\n                nodefs.readFile(uploads, (error, data) => {\n                    if (error) {\n                        return response.status(400).json({ message: \"An error occured when reading the file from the uploads folder\", error: error });\n                    }\n                    else {\n                        callback(null, data);\n                    }\n                });\n            }\n        ], (err, result) => {\n            const cwd = path.join(__dirname, 'repository', request.body.userId, request.body.path, request.files[0].originalname);\n            nodefs.writeFile(cwd, result[0], (error) => {\n                if (error) {\n                    return response.status(400).json({ message: \"An error occured when writing the file to the folder\", error: error });\n                }\n                else {\n                    cmd.run(`rm -rf ./uploads/${request.files[0].originalname.replace(/ /g, '\\\\\\ ')}`);\n                    // this.createThumbnailFromFile(cwd, request.body.userId, request.files[0].originalname)\n                    this.createEntity({\n                        originalName: request.files[0].originalname,\n                        cwd: request.body.path,\n                        path: path.join(request.body.path, request.files[0].originalname),\n                        id: request.body.userId,\n                        absPath: cwd,\n                        type: entity_type_1.EntityTypes.File,\n                        meta: null,\n                    });\n                    return response.status(204).end();\n                }\n            });\n        });\n    }\n    deleteItem(request, response) {\n        const entities = request.body.entities;\n        const userId = request.body.id;\n        if (!entities)\n            response.status(400).end();\n        try {\n            async.each(entities, (entity, callback) => __awaiter(this, void 0, void 0, function* () {\n                const cwd = path.join(__dirname, 'repository', userId, request.body.path, entity.name);\n                if (entity.type === 'Folder') {\n                    const exp = new RegExp(entity.path);\n                    const outcome = yield filesModel.updateMany({ UserId: userId }, { $pull: { Files: { Path: { $regex: exp } } } });\n                }\n                else {\n                    const iconPath = path.resolve('thumbnails', userId, `${path.parse(entity.name).name}.png`);\n                    const deleteState = yield filesModel.update({ UserId: userId }, { $pull: { Files: { Name: entity.name } } });\n                    const iconDeleteState = yield fs.remove(iconPath);\n                }\n                fs.remove(cwd, (error) => {\n                    if (error) {\n                        return response.status(500).json({ error: error });\n                    }\n                    else {\n                        callback();\n                    }\n                });\n            }), (error) => {\n                if (error) {\n                    return response.status(500).json({ error: error });\n                }\n                else {\n                    return response.status(201).end();\n                }\n            });\n        }\n        catch (error) {\n            return response.status(500).json({ message: error });\n        }\n    }\n    downloadItem(request, response) {\n        const dir = path.join(__dirname, 'repository', request.query.id, request.query.path, request.query.resource);\n        const mimeType = mime.getType(request.query.resource);\n        response.setHeader('Content-Type', mimeType);\n        response.setHeader('Content-Transfer-Encoding', 'binary');\n        response.setHeader('Content-disposition', `attachment; filename=${request.query.resource}`);\n        response.download(dir);\n    }\n    verifyLink(request, response) {\n        const { shareName, userName } = request.body;\n        this.validateShareUri(shareName, userName).then((share) => {\n            if (share.status) {\n                const folder = path.join(share.data.UserId, share.data.ShareName);\n                response['user']._id = share.data.UserId;\n                this.getRepository(request, response);\n            }\n            else {\n                return response.status(404).json({ message: \"We could not find the resource you specified\" });\n            }\n        })\n            .catch(error => {\n            return response.status(500).json({ message: error });\n        });\n    }\n    modifyFavorites(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const { fileId, userId, state } = request.body;\n                const exists = yield filesModel.find({ UserId: userId, \"Files.Id\": fileId });\n                if (!exists[0].Files) {\n                    return response.status(404).end();\n                }\n                const result = yield filesModel.update({ UserId: userId, \"Files.Id\": fileId }, { $set: { \"Files.$.IsFavorite\": state } });\n                if (result.nModified >= 1) {\n                    return response.status(200).json({ message: \"Operation Successful\" });\n                }\n                else {\n                    return response.status(400).end();\n                }\n            }\n            catch (error) {\n                return response.status(500).json(error);\n            }\n        });\n    }\n    renameEntity(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const { userId, entity, cwd } = request.body;\n            let files = [];\n            let batchUpdateResult;\n            let entityCwd = path.join(__dirname, 'repository', userId, cwd);\n            try {\n                if (entity.type === 'File') {\n                    const result = yield filesModel.update({ UserId: userId, \"Files.Id\": entity.fileId }, { $set: { \"Files.$.Name\": entity.newName, \"Files.$.Path\": entity.path, \"Files.$.ThumbnailPath\": `/${userId}/${entity.newName}` } });\n                }\n                else {\n                    const exp = new RegExp(entity.path);\n                    // how many layers down into the folder do we perform the replacement?\n                    let pathLayer = entity.path.split('/').length - 1;\n                    let cwdLayer = cwd.split('/').length;\n                    if (cwd === \"/\")\n                        cwdLayer -= 1;\n                    let documents = yield filesModel.aggregate([\n                        { $match: { UserId: userId } },\n                        { $unwind: { path: \"$Files\" } },\n                        { $match: { \"Files.Path\": { $regex: exp } } }\n                    ]);\n                    if (!documents.length)\n                        return response.status(500).json({ message: \"0 results found\" });\n                    documents.forEach((document, index) => __awaiter(this, void 0, void 0, function* () {\n                        let file = document.Files;\n                        let pathTree = file.Path.split('/');\n                        let cwdTree = file.Cwd.split('/');\n                        pathTree[pathLayer] = entity.newName;\n                        file.Path = pathTree.toString().replace(/,/g, '/');\n                        if (index > 0) {\n                            cwdTree[cwdLayer] = entity.newName;\n                            file.Cwd = cwdTree.toString().replace(/,/g, '/');\n                        }\n                        if (file.Id === entity.id) {\n                            file.Name = entity.newName;\n                        }\n                        files.push(file);\n                        try {\n                            const updateResult = yield filesModel.update({ UserId: userId }, { $pull: { Files: { Id: file.Id } } });\n                        }\n                        catch (error) {\n                            return response.status(500).json(error);\n                        }\n                    }));\n                    batchUpdateResult = yield filesModel.update({ UserId: userId }, { $push: { Files: { $each: files } } });\n                    // return response.status(200).end()\n                }\n                fs.rename(`${entityCwd}/${entity.oldName}`, `${entityCwd}/${entity.newName}`, (error) => {\n                    if (error) {\n                        return response.status(500).json(error);\n                    }\n                    return response.status(200).json(files);\n                });\n            }\n            catch (error) {\n                return response.status(500).json(error);\n            }\n        });\n    }\n    createEntity(payload) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                // check for a duplicate\n                const duplicate = yield filesModel.find({ UserId: payload.id }, { Files: { $elemMatch: { Path: payload.path } } });\n                if (duplicate[0].Files) {\n                    const result = yield filesModel.update({ UserId: payload.id }, { $pull: { Files: { Name: payload.originalName } } });\n                }\n                const stats = yield fs.stat(payload.absPath);\n                const entity = {\n                    Id: uuid.v4(),\n                    Name: payload.originalName,\n                    Type: payload.type,\n                    Size: stats.size,\n                    Cwd: payload.cwd,\n                    Path: payload.path,\n                    ThumbnailPath: payload.type === entity_type_1.EntityTypes.File ? `/${payload.id}/${path.parse(payload.originalName).name}.png` : payload.icon,\n                    IsFavorite: false,\n                    IsShared: false,\n                    CreatedOn: new Date(),\n                    EditedOn: new Date(),\n                    ShareData: payload.meta,\n                    MetaData: payload.meta\n                };\n                yield filesModel.updateOne({ UserId: payload.id }, { $push: { Files: entity } });\n            }\n            catch (error) {\n                return express_1.response.status(500).end();\n            }\n        });\n    }\n    createThumbnailFromFile(source, id, file) {\n        let destination = path.resolve('thumbnails', id);\n        try {\n            if (true) {\n                this.createThumbnailInDevelopment(source, file, destination);\n            }\n            return;\n            //  else {\n            //      this.createThumbnailInProduction(source, destination, file)\n            //  }\n        }\n        catch (error) {\n            console.log(error);\n            return;\n        }\n    }\n    createThumbnailInProduction(source, destination, file) {\n        let thumbnail = new Thumbnail(source, destination);\n        thumbnail.ensureThumbnail(file, 90, 120, (error, filename) => {\n            if (error) {\n                this.createThumbnailFromSvg(destination, file);\n            }\n            else {\n                console.log(\"Thumbnail created at: \" + filename);\n            }\n        });\n    }\n    createThumbnailInDevelopment(source, file, destination) {\n        const options = {\n            size: 256,\n            folder: destination\n        };\n        quicklookThumbnail.create(source, options, (error, result) => {\n            if (error) {\n                this.createThumbnailFromSvg(destination, file);\n            }\n            else {\n                console.log(\"Thumbnail created at: \" + result);\n            }\n        });\n    }\n    createThumbnailFromSvg(destination, file) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const icon = prettyIcon.getIcon(file, 'svg');\n            const sourcePath = path.resolve('node_modules/pretty-file-icons/svg', icon);\n            let outputFile = `${destination}/${path.parse(file).name}.png`; //.replace(/\\.\\s/, ' ').split('.')[0]\n            const settings = {\n                outputFilePath: outputFile,\n                width: 90,\n                height: 120\n            };\n            try {\n                const destPath = yield convert_svg_to_png_1.convertFile(sourcePath, settings);\n                console.log(\"File Icon written to: \" + destPath);\n            }\n            catch (error) {\n                console.log(error);\n            }\n        });\n    }\n    validateShareUri(shareName, userName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                let resource = {\n                    ShareName: shareName\n                };\n                if (userName) {\n                    resource.UserName = userName;\n                }\n                const share = yield sharedFolderModel.findOne(resource);\n                const result = {\n                    data: share,\n                    status: (share) ? true : false\n                };\n                return result;\n            }\n            catch (error) {\n                return express_1.response.status(400).json({ message: error });\n            }\n        });\n    }\n};\n__decorate([\n    core_1.Get(''),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], RepositoryController.prototype, \"getRepository\", null);\n__decorate([\n    core_1.Post('create') // /:folder*?/:data*?\n    ,\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Object)\n], RepositoryController.prototype, \"createNewFolder\", null);\n__decorate([\n    core_1.Post('upload'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Object)\n], RepositoryController.prototype, \"uploadFile\", null);\n__decorate([\n    core_1.Post('delete'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", void 0)\n], RepositoryController.prototype, \"deleteItem\", null);\n__decorate([\n    core_1.Get('download'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", void 0)\n], RepositoryController.prototype, \"downloadItem\", null);\n__decorate([\n    core_1.Post('verify'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", void 0)\n], RepositoryController.prototype, \"verifyLink\", null);\n__decorate([\n    core_1.Post('favorite'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], RepositoryController.prototype, \"modifyFavorites\", null);\n__decorate([\n    core_1.Post('rename'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], RepositoryController.prototype, \"renameEntity\", null);\nRepositoryController = __decorate([\n    core_1.Controller('api/repo')\n    // @ClassMiddleware(JwtInterceptor.checkJWTToken)\n], RepositoryController);\nexports.RepositoryController = RepositoryController;\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./src/controllers/coolshare/repo.controller.ts?");

/***/ }),

/***/ "./src/controllers/mindful-meals/kitchen.controller.ts":
/*!*************************************************************!*\
  !*** ./src/controllers/mindful-meals/kitchen.controller.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst cookbook_model_1 = __webpack_require__(/*! ../../models/cookbook.model */ \"./src/models/cookbook.model.ts\");\nconst core_1 = __webpack_require__(/*! @overnightjs/core */ \"@overnightjs/core\");\nconst jwt_interceptor_1 = __webpack_require__(/*! ../../middleware/jwt.interceptor */ \"./src/middleware/jwt.interceptor.ts\");\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\");\nconst pantry_model_1 = __webpack_require__(/*! ../../models/pantry.model */ \"./src/models/pantry.model.ts\");\nlet pantryModel = new pantry_model_1.PantryItems().getModelForClass(pantry_model_1.PantryItems);\nlet recipesModel = new cookbook_model_1.Recipes().getModelForClass(cookbook_model_1.Recipes);\nlet KitchenController = class KitchenController {\n    getAllRecipes(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                let recipes = yield recipesModel.find({}, null, { limit: 15 }).lean();\n                let count = yield recipesModel.count({});\n                if (recipes) {\n                    recipes.map((recipe) => {\n                        delete recipe._id;\n                        return recipe.id = this.generateId(recipe.label);\n                    });\n                    return response.status(200).json({ recipes: recipes, count: count });\n                }\n                else {\n                    return response.status(401);\n                }\n            }\n            catch (error) {\n                return response.status(500).json({ error: error });\n            }\n        });\n    }\n    saveRecipe(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const recipe = Object.assign({}, request.body.recipe);\n            if (!recipe) {\n                return response.status(400).json({ message: \"A recipe could not be found\" });\n            }\n            try {\n                const result = yield recipesModel.create(recipe);\n                if (result) {\n                    return response.status(200).json({ message: \"Recipe was saved successfully\" });\n                }\n            }\n            catch (error) {\n                return response.status(500).json({ error: error });\n            }\n        });\n    }\n    getPantryItemsById(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const userId = request.query.userId;\n            if (!userId) {\n                return response.status(401).json({ message: \"A UserId is needed to get pantry items\" });\n            }\n            try {\n                let pantry = yield pantryModel.find({ UserId: userId });\n                if (pantry) {\n                    pantry = yield this.checkExpirationStatus(pantry);\n                    return response.status(200).json({ pantry: pantry });\n                }\n                else {\n                    return response.status(404).json({ message: \"You do not have any pantry items\" });\n                }\n            }\n            catch (error) {\n                return response.status(500).json({ error: error });\n            }\n        });\n    }\n    savePantryItem(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            let pantryItem = request.body.item;\n            if (!pantryItem) {\n                return response.status(401).json({ message: \"We could not find the pantry item you are trying to save\" });\n            }\n            try {\n                let pantry = yield pantryModel.create(pantryItem);\n                if (pantry) {\n                    return response.status(201).json({ message: \"Your pantry item was saved successfully\" });\n                }\n                else {\n                    return response.status(404).json({ message: \"Your pantry item could not be added\" });\n                }\n            }\n            catch (error) {\n                return response.status(500).json({ error: error });\n            }\n        });\n    }\n    updatePantryItem(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            let pantryItem = request.body.item;\n            if (!pantryItem) {\n                return response.status(401).json({ message: \"We could not find the pantry item you are trying to update\" });\n            }\n            try {\n                let pantry = yield pantryModel.updateOne({ _id: pantryItem.id }, pantryItem.changes);\n                if (pantry.nModified === 1) {\n                    return response.status(201).json({ message: \"Your pantry item was saved successfully\" });\n                }\n                else {\n                    return response.status(404).json({ message: \"Your pantry item could not be updated\" });\n                }\n            }\n            catch (error) {\n                return response.status(500).json({ error: error });\n            }\n        });\n    }\n    deletePantryItem(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            let pantryItem = request.params.id;\n            if (!pantryItem) {\n                return response.status(401).json({ message: \"We could not find the pantry item you are trying to delete\" });\n            }\n            try {\n                let pantry = yield pantryModel.deleteOne({ _id: pantryItem });\n                if (pantry.deletedCount === 1) {\n                    return response.status(201).json({ message: \"Your pantry item was deleted successfully\" });\n                }\n                else {\n                    return response.status(404).json({ message: \"Your pantry item could not be deleted\" });\n                }\n            }\n            catch (error) {\n                return response.status(500).json({ error: error });\n            }\n        });\n    }\n    getNumberOfRecipesInUsersCookbook(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (!request.body.id) {\n                return response.status(404).json({ message: \"An Id is required\" });\n            }\n            try {\n                let total = yield recipesModel.count({});\n                return response.status(200).json({ data: total });\n            }\n            catch (error) {\n                return response.status(500).json(error);\n            }\n        });\n    }\n    checkExpirationStatus(pantry) {\n        return __awaiter(this, void 0, void 0, function* () {\n            let now = new Date();\n            return yield pantry.map((item) => {\n                item.id = this.generateId(item.Name);\n                if (item.ExpirationDate < now) {\n                    item.ExpirationStatus = \"EXPIRED\";\n                    // artifically set the expiration date ( for testing purpose )\n                    // item.ExpirationDate = new Date(Date.now() + 3600000);\n                    pantryModel.findByIdAndUpdate({ _id: item._id }, { ExpirationStatus: \"EXPIRED\" });\n                }\n                else {\n                    item.ExpirationStatus = \"FRESH\";\n                }\n                return item;\n            });\n        });\n    }\n    generateId(name) {\n        return crypto.createHash('md5').update(name).digest('hex');\n    }\n};\n__decorate([\n    core_1.Get('cookbook'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], KitchenController.prototype, \"getAllRecipes\", null);\n__decorate([\n    core_1.Post('cookbook'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], KitchenController.prototype, \"saveRecipe\", null);\n__decorate([\n    core_1.Get('pantry'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], KitchenController.prototype, \"getPantryItemsById\", null);\n__decorate([\n    core_1.Post('pantry'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], KitchenController.prototype, \"savePantryItem\", null);\n__decorate([\n    core_1.Put('pantry'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], KitchenController.prototype, \"updatePantryItem\", null);\n__decorate([\n    core_1.Delete('pantry/:id'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], KitchenController.prototype, \"deletePantryItem\", null);\n__decorate([\n    core_1.Get('total'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], KitchenController.prototype, \"getNumberOfRecipesInUsersCookbook\", null);\nKitchenController = __decorate([\n    core_1.Controller('api/kitchen')\n], KitchenController);\nexports.KitchenController = KitchenController;\n\n\n//# sourceURL=webpack:///./src/controllers/mindful-meals/kitchen.controller.ts?");

/***/ }),

/***/ "./src/controllers/notifications/notifications.controller.ts":
/*!*******************************************************************!*\
  !*** ./src/controllers/notifications/notifications.controller.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst core_1 = __webpack_require__(/*! @overnightjs/core */ \"@overnightjs/core\");\nconst jwt_interceptor_1 = __webpack_require__(/*! ../../middleware/jwt.interceptor */ \"./src/middleware/jwt.interceptor.ts\");\nconst notifications_model_1 = __webpack_require__(/*! ../../models/notifications.model */ \"./src/models/notifications.model.ts\");\nconst notificationModel = new notifications_model_1.Notifications().getModelForClass(notifications_model_1.Notifications);\nlet NotificationController = \n// @ClassMiddleware(JwtInterceptor.checkJWTToken)\nclass NotificationController {\n    getNotifications(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const id = request.query.id;\n            if (!id) {\n                return response.status(400).end();\n            }\n            try {\n                const data = yield notificationModel.find({ UserId: id });\n                let result = Object.assign({}, data[0].toObject());\n                return response.status(200).json(result);\n            }\n            catch (error) {\n                return response.status(500).json(error);\n            }\n        });\n    }\n    createNotification(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const userId = request.body.userId;\n            if (!userId) {\n                return response.status(400).end();\n            }\n            try {\n                let model = yield notificationModel.find({ UserId: userId });\n                if (!model) {\n                    return response.status(404).end();\n                }\n                const notification = {\n                    type: request.body.type,\n                    title: request.body.title,\n                    options: request.body.options,\n                    createdOn: request.body.createdOn\n                };\n                const data = yield notificationModel.updateOne({\n                    UserId: userId\n                }, {\n                    $push: {\n                        Notifications: notification\n                    },\n                    $set: {\n                        NotificationBadgeHidden: false\n                    }\n                });\n                if (data) {\n                    return response.status(201).json({ notifications: notification, notificationBadgeHidden: false });\n                }\n                else {\n                    return response.status(404).end();\n                }\n            }\n            catch (error) {\n                return response.status(500).json(error);\n            }\n        });\n    }\n    deleteAllNotifications(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const id = request.params.id;\n            if (!id) {\n                return response.status(400).json();\n            }\n            try {\n                const model = yield notificationModel.find({ UserId: id });\n                if (!model.length) {\n                    return response.status(404).end();\n                }\n                const result = yield notificationModel.updateOne({ UserId: id }, {\n                    $pull: {\n                        Notifications: {}\n                    },\n                    $set: {\n                        NotificationBadgeHidden: true\n                    }\n                }, { multi: true });\n                if (result.nModified >= 1) {\n                    return response.status(204).end();\n                }\n                else {\n                    return response.status(500).end();\n                }\n            }\n            catch (error) {\n                return response.status(500).end();\n            }\n        });\n    }\n    setNotificationBadgeState(request, response) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const id = request.params.id;\n            const viewState = request.body.state;\n            if (!id) {\n                return response.status(400).end();\n            }\n            try {\n                const model = yield notificationModel.find({ UserId: id });\n                if (!model) {\n                    return response.status(404).end();\n                }\n                const state = yield notificationModel.updateOne({\n                    UserId: id\n                }, {\n                    $set: {\n                        NotificationBadgeHidden: viewState\n                    }\n                });\n                if (state.ok === 1) {\n                    return response.status(204).end();\n                }\n                else {\n                    return response.status(500).end();\n                }\n            }\n            catch (error) {\n                return response.status(500).end();\n            }\n        });\n    }\n};\n__decorate([\n    core_1.Get(''),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], NotificationController.prototype, \"getNotifications\", null);\n__decorate([\n    core_1.Post('create'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], NotificationController.prototype, \"createNotification\", null);\n__decorate([\n    core_1.Delete('deleteall/:id'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], NotificationController.prototype, \"deleteAllNotifications\", null);\n__decorate([\n    core_1.Put(':id'),\n    core_1.Middleware(jwt_interceptor_1.JwtInterceptor.checkJWTToken),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], NotificationController.prototype, \"setNotificationBadgeState\", null);\nNotificationController = __decorate([\n    core_1.Controller('api/notifications')\n    // @ClassMiddleware(JwtInterceptor.checkJWTToken)\n], NotificationController);\nexports.NotificationController = NotificationController;\n\n\n//# sourceURL=webpack:///./src/controllers/notifications/notifications.controller.ts?");

/***/ }),

/***/ "./src/db/db.connection.ts":
/*!*********************************!*\
  !*** ./src/db/db.connection.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst logger_1 = __webpack_require__(/*! @overnightjs/logger */ \"@overnightjs/logger\");\nclass Database {\n    constructor() {\n        this.connect();\n    }\n    connect() {\n        return __awaiter(this, void 0, void 0, function* () {\n            const connectionString = process.env.MONGODB_URI || 'mongodb://heroku_cf279h4z:8tuqnuihu94nu4j3mdft4ku5pf@ds131676.mlab.com:31676/heroku_cf279h4z';\n            const options = {\n                useNewUrlParser: true,\n                useCreateIndex: true,\n                useUnifiedTopology: true\n            };\n            yield mongoose.connect(connectionString, options).then(() => logger_1.Logger.Info(`Mongoose connected to ds131676.mlab.com:31676/heroku_cf279h4z`)).catch((error) => logger_1.Logger.Err(`Database connection error: ${error}`));\n        });\n    }\n}\nexports.Database = Database;\n\n\n//# sourceURL=webpack:///./src/db/db.connection.ts?");

/***/ }),

/***/ "./src/middleware/jwt.interceptor.ts":
/*!*******************************************!*\
  !*** ./src/middleware/jwt.interceptor.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst authentication_model_1 = __webpack_require__(/*! ../models/authentication.model */ \"./src/models/authentication.model.ts\");\nconst UserModel = new authentication_model_1.User().getModelForClass(authentication_model_1.User);\nclass JwtInterceptor {\n    static checkJWTToken(request, response, next) {\n        let token = request.headers.authorization;\n        if (token) {\n            const user = new UserModel();\n            if (token.startsWith('Bearer ')) {\n                token = token.slice(7, token.length).trimLeft();\n            }\n            else {\n                response.status(400).json({ message: \"Invalid Token\" });\n            }\n            user.verifySessionToken(token).then((data) => {\n                response['user'] = data;\n                next();\n            })\n                .catch((error) => {\n                return response.status(401).json({ error: error });\n            });\n        }\n        else {\n            return response.status(400).json({ message: \"A valid token is required to access this resource\" });\n        }\n    }\n}\nexports.JwtInterceptor = JwtInterceptor;\n\n\n//# sourceURL=webpack:///./src/middleware/jwt.interceptor.ts?");

/***/ }),

/***/ "./src/models/authentication.model.ts":
/*!********************************************!*\
  !*** ./src/models/authentication.model.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst typegoose_1 = __webpack_require__(/*! @hasezoey/typegoose */ \"@hasezoey/typegoose\");\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst util = __webpack_require__(/*! util */ \"util\");\nconst RSA_PUBLIC_KEY = fs.readFileSync('./.keys/public.key');\nconst RSA_PRIVATE_KEY = fs.readFileSync('./.keys/private.key');\n// const PEPPER = fs.readFileSync('./.keys/pepper.key');\nexports.signJwt = util.promisify(jwt.sign);\nclass User extends typegoose_1.Typegoose {\n    setPassword(Password) {\n        this.Salt = crypto.randomBytes(16).toString('hex');\n        this.Hash = crypto.pbkdf2Sync(Password, this.Salt, 1000, 64, 'sha512').toString('hex');\n        return this.Hash;\n    }\n    validatePassword(Password) {\n        let Hash = crypto.pbkdf2Sync(Password, this.Salt, 1000, 64, 'sha512').toString('hex');\n        return this.Hash = Hash;\n    }\n    generateSessionToken() {\n        return __awaiter(this, void 0, void 0, function* () {\n            let expiry = new Date();\n            expiry.setDate(expiry.getDate() + 7);\n            const payload = {\n                _id: this._id,\n                email: this.UserName,\n                exp: Math.floor(expiry.getTime() / 1000)\n            };\n            return yield jwt.sign(payload, RSA_PRIVATE_KEY, { algorithm: 'RS256' });\n        });\n    }\n    verifySessionToken(token) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const payload = yield jwt.verify(token, RSA_PUBLIC_KEY);\n            return payload;\n        });\n    }\n    generateCsrfToken() {\n        return __awaiter(this, void 0, void 0, function* () {\n            const payload = yield crypto.randomBytes(32).toString('hex');\n            return payload;\n        });\n    }\n}\n__decorate([\n    typegoose_1.prop({ unique: true, required: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"UserName\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], User.prototype, \"FirstName\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], User.prototype, \"LastName\", void 0);\n__decorate([\n    typegoose_1.prop({ unique: true, required: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"Email\", void 0);\n__decorate([\n    typegoose_1.prop({ required: false, unique: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"Salt\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Date)\n], User.prototype, \"CreatedOn\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Date)\n], User.prototype, \"EditedOn\", void 0);\n__decorate([\n    typegoose_1.prop({ required: true, unique: true }),\n    __metadata(\"design:type\", String)\n], User.prototype, \"Hash\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], User.prototype, \"ProfilePicture\", void 0);\n__decorate([\n    typegoose_1.instanceMethod,\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", void 0)\n], User.prototype, \"setPassword\", null);\n__decorate([\n    typegoose_1.instanceMethod,\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", void 0)\n], User.prototype, \"validatePassword\", null);\n__decorate([\n    typegoose_1.instanceMethod,\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", Promise)\n], User.prototype, \"generateSessionToken\", null);\n__decorate([\n    typegoose_1.instanceMethod,\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", Promise)\n], User.prototype, \"verifySessionToken\", null);\n__decorate([\n    typegoose_1.instanceMethod,\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", Promise)\n], User.prototype, \"generateCsrfToken\", null);\nexports.User = User;\n\n\n//# sourceURL=webpack:///./src/models/authentication.model.ts?");

/***/ }),

/***/ "./src/models/cookbook.model.ts":
/*!**************************************!*\
  !*** ./src/models/cookbook.model.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst typegoose_1 = __webpack_require__(/*! @hasezoey/typegoose */ \"@hasezoey/typegoose\");\nclass Recipes extends typegoose_1.Typegoose {\n}\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"calories\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"cautions\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"dietLabels\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"healthLabels\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], Recipes.prototype, \"image\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"ingredientLines\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"ingredients\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"label\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"shareAs\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"source\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"totalDaily\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Recipes.prototype, \"totalNutrients\", void 0);\nexports.Recipes = Recipes;\n\n\n//# sourceURL=webpack:///./src/models/cookbook.model.ts?");

/***/ }),

/***/ "./src/models/entity.type.ts":
/*!***********************************!*\
  !*** ./src/models/entity.type.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar EntityTypes;\n(function (EntityTypes) {\n    EntityTypes[\"Folder\"] = \"Folder\";\n    EntityTypes[\"File\"] = \"File\";\n})(EntityTypes = exports.EntityTypes || (exports.EntityTypes = {}));\n\n\n//# sourceURL=webpack:///./src/models/entity.type.ts?");

/***/ }),

/***/ "./src/models/files.model.ts":
/*!***********************************!*\
  !*** ./src/models/files.model.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst typegoose_1 = __webpack_require__(/*! @hasezoey/typegoose */ \"@hasezoey/typegoose\");\nclass Files extends typegoose_1.Typegoose {\n}\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Array)\n], Files.prototype, \"Files\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], Files.prototype, \"UserId\", void 0);\nexports.Files = Files;\n\n\n//# sourceURL=webpack:///./src/models/files.model.ts?");

/***/ }),

/***/ "./src/models/notifications.model.ts":
/*!*******************************************!*\
  !*** ./src/models/notifications.model.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst typegoose_1 = __webpack_require__(/*! @hasezoey/typegoose */ \"@hasezoey/typegoose\");\nclass Notifications extends typegoose_1.Typegoose {\n}\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], Notifications.prototype, \"Notifications\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], Notifications.prototype, \"UserId\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Boolean)\n], Notifications.prototype, \"NotificationBadgeHidden\", void 0);\nexports.Notifications = Notifications;\n\n\n//# sourceURL=webpack:///./src/models/notifications.model.ts?");

/***/ }),

/***/ "./src/models/pantry.model.ts":
/*!************************************!*\
  !*** ./src/models/pantry.model.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst typegoose_1 = __webpack_require__(/*! @hasezoey/typegoose */ \"@hasezoey/typegoose\");\nclass PantryItems extends typegoose_1.Typegoose {\n}\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], PantryItems.prototype, \"Name\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Number)\n], PantryItems.prototype, \"Quantity\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], PantryItems.prototype, \"UserId\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Date)\n], PantryItems.prototype, \"ExpirationDate\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], PantryItems.prototype, \"Category\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], PantryItems.prototype, \"ExpirationStatus\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Number)\n], PantryItems.prototype, \"Calories\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Number)\n], PantryItems.prototype, \"ServingSize\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Array)\n], PantryItems.prototype, \"Tags\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Date)\n], PantryItems.prototype, \"CreatedOn\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Boolean)\n], PantryItems.prototype, \"IsDeleted\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Date)\n], PantryItems.prototype, \"UpdatedOn\", void 0);\nexports.PantryItems = PantryItems;\n\n\n//# sourceURL=webpack:///./src/models/pantry.model.ts?");

/***/ }),

/***/ "./src/models/shared-folder.model.ts":
/*!*******************************************!*\
  !*** ./src/models/shared-folder.model.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst typegoose_1 = __webpack_require__(/*! @hasezoey/typegoose */ \"@hasezoey/typegoose\");\nclass SharedFolders extends typegoose_1.Typegoose {\n}\n__decorate([\n    typegoose_1.prop({ required: true }),\n    __metadata(\"design:type\", String)\n], SharedFolders.prototype, \"UserId\", void 0);\n__decorate([\n    typegoose_1.prop({ required: true }),\n    __metadata(\"design:type\", String)\n], SharedFolders.prototype, \"Path\", void 0);\n__decorate([\n    typegoose_1.prop({ required: true }),\n    __metadata(\"design:type\", String)\n], SharedFolders.prototype, \"Type\", void 0);\n__decorate([\n    typegoose_1.prop({ required: true }),\n    __metadata(\"design:type\", String)\n], SharedFolders.prototype, \"ShareName\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", String)\n], SharedFolders.prototype, \"UserName\", void 0);\n__decorate([\n    typegoose_1.prop({ required: true }),\n    __metadata(\"design:type\", Array)\n], SharedFolders.prototype, \"Invitees\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Array)\n], SharedFolders.prototype, \"Files\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Date)\n], SharedFolders.prototype, \"CreatedOn\", void 0);\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Date)\n], SharedFolders.prototype, \"EditedOn\", void 0);\nexports.SharedFolders = SharedFolders;\n\n\n//# sourceURL=webpack:///./src/models/shared-folder.model.ts?");

/***/ }),

/***/ "./src/models/user-images.model.ts":
/*!*****************************************!*\
  !*** ./src/models/user-images.model.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst typegoose_1 = __webpack_require__(/*! @hasezoey/typegoose */ \"@hasezoey/typegoose\");\nclass UserImagesModel extends typegoose_1.Typegoose {\n}\n__decorate([\n    typegoose_1.prop(),\n    __metadata(\"design:type\", Object)\n], UserImagesModel.prototype, \"ProfilePicture\", void 0);\n__decorate([\n    typegoose_1.prop({ unique: true }),\n    __metadata(\"design:type\", String)\n], UserImagesModel.prototype, \"UserId\", void 0);\nexports.UserImagesModel = UserImagesModel;\n\n\n//# sourceURL=webpack:///./src/models/user-images.model.ts?");

/***/ }),

/***/ "./start.ts":
/*!******************!*\
  !*** ./start.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst app_1 = __webpack_require__(/*! ./app */ \"./app.ts\");\n__webpack_require__(/*! jest */ \"jest\");\nlet server = new app_1.PortfolioServer();\n// server.start();\n\n\n//# sourceURL=webpack:///./start.ts?");

/***/ }),

/***/ "@hasezoey/typegoose":
/*!**************************************!*\
  !*** external "@hasezoey/typegoose" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@hasezoey/typegoose\");\n\n//# sourceURL=webpack:///external_%22@hasezoey/typegoose%22?");

/***/ }),

/***/ "@overnightjs/core":
/*!************************************!*\
  !*** external "@overnightjs/core" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@overnightjs/core\");\n\n//# sourceURL=webpack:///external_%22@overnightjs/core%22?");

/***/ }),

/***/ "@overnightjs/logger":
/*!**************************************!*\
  !*** external "@overnightjs/logger" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@overnightjs/logger\");\n\n//# sourceURL=webpack:///external_%22@overnightjs/logger%22?");

/***/ }),

/***/ "async":
/*!************************!*\
  !*** external "async" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"async\");\n\n//# sourceURL=webpack:///external_%22async%22?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bcrypt\");\n\n//# sourceURL=webpack:///external_%22bcrypt%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cluster\");\n\n//# sourceURL=webpack:///external_%22cluster%22?");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"compression\");\n\n//# sourceURL=webpack:///external_%22compression%22?");

/***/ }),

/***/ "convert-svg-to-png":
/*!*************************************!*\
  !*** external "convert-svg-to-png" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"convert-svg-to-png\");\n\n//# sourceURL=webpack:///external_%22convert-svg-to-png%22?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cookie-parser\");\n\n//# sourceURL=webpack:///external_%22cookie-parser%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "fs-extra":
/*!***************************!*\
  !*** external "fs-extra" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs-extra\");\n\n//# sourceURL=webpack:///external_%22fs-extra%22?");

/***/ }),

/***/ "jest":
/*!***********************!*\
  !*** external "jest" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jest\");\n\n//# sourceURL=webpack:///external_%22jest%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "mime":
/*!***********************!*\
  !*** external "mime" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mime\");\n\n//# sourceURL=webpack:///external_%22mime%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"morgan\");\n\n//# sourceURL=webpack:///external_%22morgan%22?");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"multer\");\n\n//# sourceURL=webpack:///external_%22multer%22?");

/***/ }),

/***/ "node-cmd":
/*!***************************!*\
  !*** external "node-cmd" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-cmd\");\n\n//# sourceURL=webpack:///external_%22node-cmd%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "pretty-file-icons":
/*!************************************!*\
  !*** external "pretty-file-icons" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"pretty-file-icons\");\n\n//# sourceURL=webpack:///external_%22pretty-file-icons%22?");

/***/ }),

/***/ "quicklook-thumbnail":
/*!**************************************!*\
  !*** external "quicklook-thumbnail" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"quicklook-thumbnail\");\n\n//# sourceURL=webpack:///external_%22quicklook-thumbnail%22?");

/***/ }),

/***/ "thumbnail":
/*!****************************!*\
  !*** external "thumbnail" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"thumbnail\");\n\n//# sourceURL=webpack:///external_%22thumbnail%22?");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");\n\n//# sourceURL=webpack:///external_%22util%22?");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");\n\n//# sourceURL=webpack:///external_%22uuid%22?");

/***/ })

/******/ });