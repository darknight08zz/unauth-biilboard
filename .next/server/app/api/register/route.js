/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/register/route";
exports.ids = ["app/api/register/route"];
exports.modules = {

/***/ "(rsc)/./app/api/register/route.ts":
/*!***********************************!*\
  !*** ./app/api/register/route.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/models/User */ \"(rsc)/./models/User.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n\n\n\n\nasync function POST(req) {\n    try {\n        const { name, email, password, role } = await req.json();\n        if (!name || !email || !password) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: \"Missing required fields\"\n            }, {\n                status: 400\n            });\n        }\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n        const existingUser = await _models_User__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findOne({\n            email\n        });\n        if (existingUser) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: \"User already exists\"\n            }, {\n                status: 400\n            });\n        }\n        const hashedPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_3__[\"default\"].hash(password, 10);\n        const user = await _models_User__WEBPACK_IMPORTED_MODULE_2__[\"default\"].create({\n            name,\n            email,\n            password: hashedPassword,\n            role: role || 'citizen'\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"User created successfully\",\n            userId: user._id\n        }, {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"Registration error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3JlZ2lzdGVyL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQTJDO0FBQ1Y7QUFDQTtBQUNIO0FBRXZCLGVBQWVJLEtBQUtDLEdBQVk7SUFDbkMsSUFBSTtRQUNBLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUVDLFFBQVEsRUFBRUMsSUFBSSxFQUFFLEdBQUcsTUFBTUosSUFBSUssSUFBSTtRQUV0RCxJQUFJLENBQUNKLFFBQVEsQ0FBQ0MsU0FBUyxDQUFDQyxVQUFVO1lBQzlCLE9BQU9SLHFEQUFZQSxDQUFDVSxJQUFJLENBQ3BCO2dCQUFFQyxTQUFTO1lBQTBCLEdBQ3JDO2dCQUFFQyxRQUFRO1lBQUk7UUFFdEI7UUFFQSxNQUFNWCxtREFBU0E7UUFFZixNQUFNWSxlQUFlLE1BQU1YLG9EQUFJQSxDQUFDWSxPQUFPLENBQUM7WUFBRVA7UUFBTTtRQUVoRCxJQUFJTSxjQUFjO1lBQ2QsT0FBT2IscURBQVlBLENBQUNVLElBQUksQ0FDcEI7Z0JBQUVDLFNBQVM7WUFBc0IsR0FDakM7Z0JBQUVDLFFBQVE7WUFBSTtRQUV0QjtRQUVBLE1BQU1HLGlCQUFpQixNQUFNWixxREFBVyxDQUFDSyxVQUFVO1FBRW5ELE1BQU1TLE9BQU8sTUFBTWYsb0RBQUlBLENBQUNnQixNQUFNLENBQUM7WUFDM0JaO1lBQ0FDO1lBQ0FDLFVBQVVPO1lBQ1ZOLE1BQU1BLFFBQVE7UUFDbEI7UUFFQSxPQUFPVCxxREFBWUEsQ0FBQ1UsSUFBSSxDQUNwQjtZQUFFQyxTQUFTO1lBQTZCUSxRQUFRRixLQUFLRyxHQUFHO1FBQUMsR0FDekQ7WUFBRVIsUUFBUTtRQUFJO0lBRXRCLEVBQUUsT0FBT1MsT0FBTztRQUNaQyxRQUFRRCxLQUFLLENBQUMsdUJBQXVCQTtRQUNyQyxPQUFPckIscURBQVlBLENBQUNVLElBQUksQ0FDcEI7WUFBRUMsU0FBUztRQUF3QixHQUNuQztZQUFFQyxRQUFRO1FBQUk7SUFFdEI7QUFDSiIsInNvdXJjZXMiOlsiRDpcXEJpbGxib2FyZFxcdW5hdXRoLWJpaWxib2FyZFxcYXBwXFxhcGlcXHJlZ2lzdGVyXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IGRiQ29ubmVjdCBmcm9tIFwiQC9saWIvZGJcIjtcclxuaW1wb3J0IFVzZXIgZnJvbSBcIkAvbW9kZWxzL1VzZXJcIjtcclxuaW1wb3J0IGJjcnlwdCBmcm9tIFwiYmNyeXB0anNcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogUmVxdWVzdCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIGVtYWlsLCBwYXNzd29yZCwgcm9sZSB9ID0gYXdhaXQgcmVxLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCFuYW1lIHx8ICFlbWFpbCB8fCAhcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgICAgICAgICAgeyBtZXNzYWdlOiBcIk1pc3NpbmcgcmVxdWlyZWQgZmllbGRzXCIgfSxcclxuICAgICAgICAgICAgICAgIHsgc3RhdHVzOiA0MDAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXdhaXQgZGJDb25uZWN0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nVXNlciA9IGF3YWl0IFVzZXIuZmluZE9uZSh7IGVtYWlsIH0pO1xyXG5cclxuICAgICAgICBpZiAoZXhpc3RpbmdVc2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICAgICAgICAgIHsgbWVzc2FnZTogXCJVc2VyIGFscmVhZHkgZXhpc3RzXCIgfSxcclxuICAgICAgICAgICAgICAgIHsgc3RhdHVzOiA0MDAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaGFzaGVkUGFzc3dvcmQgPSBhd2FpdCBiY3J5cHQuaGFzaChwYXNzd29yZCwgMTApO1xyXG5cclxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5jcmVhdGUoe1xyXG4gICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICBlbWFpbCxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGhhc2hlZFBhc3N3b3JkLFxyXG4gICAgICAgICAgICByb2xlOiByb2xlIHx8ICdjaXRpemVuJywgLy8gRGVmYXVsdCB0byBjaXRpemVuIGlmIG5vdCBwcm92aWRlZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgICAgIHsgbWVzc2FnZTogXCJVc2VyIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XCIsIHVzZXJJZDogdXNlci5faWQgfSxcclxuICAgICAgICAgICAgeyBzdGF0dXM6IDIwMSB9XHJcbiAgICAgICAgKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlJlZ2lzdHJhdGlvbiBlcnJvcjpcIiwgZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICAgICAgeyBtZXNzYWdlOiBcIkludGVybmFsIHNlcnZlciBlcnJvclwiIH0sXHJcbiAgICAgICAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImRiQ29ubmVjdCIsIlVzZXIiLCJiY3J5cHQiLCJQT1NUIiwicmVxIiwibmFtZSIsImVtYWlsIiwicGFzc3dvcmQiLCJyb2xlIiwianNvbiIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJleGlzdGluZ1VzZXIiLCJmaW5kT25lIiwiaGFzaGVkUGFzc3dvcmQiLCJoYXNoIiwidXNlciIsImNyZWF0ZSIsInVzZXJJZCIsIl9pZCIsImVycm9yIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/register/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) {\n    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');\n}\nlet cached = global.mongoose;\nif (!cached) {\n    cached = global.mongoose = {\n        conn: null,\n        promise: null\n    };\n}\nasync function dbConnect() {\n    if (cached.conn) {\n        return cached.conn;\n    }\n    if (!cached.promise) {\n        const opts = {\n            bufferCommands: false\n        };\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, opts).then((mongoose)=>{\n            console.log('Successfully connected to MongoDB');\n            return mongoose;\n        });\n    }\n    try {\n        cached.conn = await cached.promise;\n    } catch (e) {\n        cached.promise = null;\n        throw e;\n    }\n    return cached.conn;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dbConnect);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWdDO0FBRWhDLE1BQU1DLGNBQWNDLFFBQVFDLEdBQUcsQ0FBQ0YsV0FBVztBQUUzQyxJQUFJLENBQUNBLGFBQWE7SUFDZCxNQUFNLElBQUlHLE1BQU07QUFDcEI7QUFXQSxJQUFJQyxTQUFTQyxPQUFPTixRQUFRO0FBRTVCLElBQUksQ0FBQ0ssUUFBUTtJQUNUQSxTQUFTQyxPQUFPTixRQUFRLEdBQUc7UUFBRU8sTUFBTTtRQUFNQyxTQUFTO0lBQUs7QUFDM0Q7QUFFQSxlQUFlQztJQUNYLElBQUlKLE9BQU9FLElBQUksRUFBRTtRQUNiLE9BQU9GLE9BQU9FLElBQUk7SUFDdEI7SUFFQSxJQUFJLENBQUNGLE9BQU9HLE9BQU8sRUFBRTtRQUNqQixNQUFNRSxPQUFPO1lBQ1RDLGdCQUFnQjtRQUNwQjtRQUVBTixPQUFPRyxPQUFPLEdBQUdSLHVEQUFnQixDQUFDQyxhQUFjUyxNQUFNRyxJQUFJLENBQUMsQ0FBQ2I7WUFDeERjLFFBQVFDLEdBQUcsQ0FBQztZQUNaLE9BQU9mO1FBQ1g7SUFDSjtJQUNBLElBQUk7UUFDQUssT0FBT0UsSUFBSSxHQUFHLE1BQU1GLE9BQU9HLE9BQU87SUFDdEMsRUFBRSxPQUFPUSxHQUFHO1FBQ1JYLE9BQU9HLE9BQU8sR0FBRztRQUNqQixNQUFNUTtJQUNWO0lBRUEsT0FBT1gsT0FBT0UsSUFBSTtBQUN0QjtBQUVBLGlFQUFlRSxTQUFTQSxFQUFDIiwic291cmNlcyI6WyJEOlxcQmlsbGJvYXJkXFx1bmF1dGgtYmlpbGJvYXJkXFxsaWJcXGRiLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBNT05HT0RCX1VSSSA9IHByb2Nlc3MuZW52Lk1PTkdPREJfVVJJO1xyXG5cclxuaWYgKCFNT05HT0RCX1VSSSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgZGVmaW5lIHRoZSBNT05HT0RCX1VSSSBlbnZpcm9ubWVudCB2YXJpYWJsZSBpbnNpZGUgLmVudi5sb2NhbCcpO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTW9uZ29vc2VDYWNoZSB7XHJcbiAgICBjb25uOiB0eXBlb2YgbW9uZ29vc2UgfCBudWxsO1xyXG4gICAgcHJvbWlzZTogUHJvbWlzZTx0eXBlb2YgbW9uZ29vc2U+IHwgbnVsbDtcclxufVxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgdmFyIG1vbmdvb3NlOiBNb25nb29zZUNhY2hlO1xyXG59XHJcblxyXG5sZXQgY2FjaGVkID0gZ2xvYmFsLm1vbmdvb3NlO1xyXG5cclxuaWYgKCFjYWNoZWQpIHtcclxuICAgIGNhY2hlZCA9IGdsb2JhbC5tb25nb29zZSA9IHsgY29ubjogbnVsbCwgcHJvbWlzZTogbnVsbCB9O1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBkYkNvbm5lY3QoKSB7XHJcbiAgICBpZiAoY2FjaGVkLmNvbm4pIHtcclxuICAgICAgICByZXR1cm4gY2FjaGVkLmNvbm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFjYWNoZWQucHJvbWlzZSkge1xyXG4gICAgICAgIGNvbnN0IG9wdHMgPSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlckNvbW1hbmRzOiBmYWxzZSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjYWNoZWQucHJvbWlzZSA9IG1vbmdvb3NlLmNvbm5lY3QoTU9OR09EQl9VUkkhLCBvcHRzKS50aGVuKChtb25nb29zZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byBNb25nb0RCJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBtb25nb29zZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY2FjaGVkLmNvbm4gPSBhd2FpdCBjYWNoZWQucHJvbWlzZTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjYWNoZWQucHJvbWlzZSA9IG51bGw7XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FjaGVkLmNvbm47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRiQ29ubmVjdDtcclxuIl0sIm5hbWVzIjpbIm1vbmdvb3NlIiwiTU9OR09EQl9VUkkiLCJwcm9jZXNzIiwiZW52IiwiRXJyb3IiLCJjYWNoZWQiLCJnbG9iYWwiLCJjb25uIiwicHJvbWlzZSIsImRiQ29ubmVjdCIsIm9wdHMiLCJidWZmZXJDb21tYW5kcyIsImNvbm5lY3QiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsImUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./models/User.ts":
/*!************************!*\
  !*** ./models/User.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst UserSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({\n    name: {\n        type: String,\n        required: [\n            true,\n            'Please provide a name'\n        ],\n        maxlength: [\n            60,\n            'Name cannot be more than 60 characters'\n        ]\n    },\n    email: {\n        type: String,\n        required: [\n            true,\n            'Please provide an email'\n        ],\n        unique: true\n    },\n    password: {\n        type: String,\n        required: [\n            true,\n            'Please provide a password'\n        ]\n    },\n    role: {\n        type: String,\n        enum: [\n            'citizen',\n            'inspector',\n            'admin'\n        ],\n        default: 'citizen'\n    }\n}, {\n    timestamps: true\n});\nconst User = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().models).User || mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('User', UserSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (User);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9tb2RlbHMvVXNlci50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNkQ7QUFXN0QsTUFBTUMsYUFBNEIsSUFBSUQsd0RBQWUsQ0FBQztJQUNsREcsTUFBTTtRQUNGQyxNQUFNQztRQUNOQyxVQUFVO1lBQUM7WUFBTTtTQUF3QjtRQUN6Q0MsV0FBVztZQUFDO1lBQUk7U0FBeUM7SUFDN0Q7SUFDQUMsT0FBTztRQUNISixNQUFNQztRQUNOQyxVQUFVO1lBQUM7WUFBTTtTQUEwQjtRQUMzQ0csUUFBUTtJQUNaO0lBQ0FDLFVBQVU7UUFDTk4sTUFBTUM7UUFDTkMsVUFBVTtZQUFDO1lBQU07U0FBNEI7SUFDakQ7SUFDQUssTUFBTTtRQUNGUCxNQUFNQztRQUNOTyxNQUFNO1lBQUM7WUFBVztZQUFhO1NBQVE7UUFDdkNDLFNBQVM7SUFDYjtBQUNKLEdBQUc7SUFBRUMsWUFBWTtBQUFLO0FBRXRCLE1BQU1DLE9BQXFCZix3REFBZSxDQUFDZSxJQUFJLElBQW9CZixxREFBYyxDQUFRLFFBQVFDO0FBRWpHLGlFQUFlYyxJQUFJQSxFQUFDIiwic291cmNlcyI6WyJEOlxcQmlsbGJvYXJkXFx1bmF1dGgtYmlpbGJvYXJkXFxtb2RlbHNcXFVzZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7IFNjaGVtYSwgRG9jdW1lbnQsIE1vZGVsIH0gZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVXNlciBleHRlbmRzIERvY3VtZW50IHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGVtYWlsOiBzdHJpbmc7XHJcbiAgICBwYXNzd29yZD86IHN0cmluZztcclxuICAgIHJvbGU6ICdjaXRpemVuJyB8ICdpbnNwZWN0b3InIHwgJ2FkbWluJztcclxuICAgIGNyZWF0ZWRBdDogRGF0ZTtcclxuICAgIHVwZGF0ZWRBdDogRGF0ZTtcclxufVxyXG5cclxuY29uc3QgVXNlclNjaGVtYTogU2NoZW1hPElVc2VyPiA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogW3RydWUsICdQbGVhc2UgcHJvdmlkZSBhIG5hbWUnXSxcclxuICAgICAgICBtYXhsZW5ndGg6IFs2MCwgJ05hbWUgY2Fubm90IGJlIG1vcmUgdGhhbiA2MCBjaGFyYWN0ZXJzJ10sXHJcbiAgICB9LFxyXG4gICAgZW1haWw6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IFt0cnVlLCAnUGxlYXNlIHByb3ZpZGUgYW4gZW1haWwnXSxcclxuICAgICAgICB1bmlxdWU6IHRydWUsXHJcbiAgICB9LFxyXG4gICAgcGFzc3dvcmQ6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IFt0cnVlLCAnUGxlYXNlIHByb3ZpZGUgYSBwYXNzd29yZCddLFxyXG4gICAgfSxcclxuICAgIHJvbGU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgZW51bTogWydjaXRpemVuJywgJ2luc3BlY3RvcicsICdhZG1pbiddLFxyXG4gICAgICAgIGRlZmF1bHQ6ICdjaXRpemVuJyxcclxuICAgIH0sXHJcbn0sIHsgdGltZXN0YW1wczogdHJ1ZSB9KTtcclxuXHJcbmNvbnN0IFVzZXI6IE1vZGVsPElVc2VyPiA9IG1vbmdvb3NlLm1vZGVscy5Vc2VyIGFzIE1vZGVsPElVc2VyPiB8fCBtb25nb29zZS5tb2RlbDxJVXNlcj4oJ1VzZXInLCBVc2VyU2NoZW1hKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXI7XHJcbiJdLCJuYW1lcyI6WyJtb25nb29zZSIsIlVzZXJTY2hlbWEiLCJTY2hlbWEiLCJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwibWF4bGVuZ3RoIiwiZW1haWwiLCJ1bmlxdWUiLCJwYXNzd29yZCIsInJvbGUiLCJlbnVtIiwiZGVmYXVsdCIsInRpbWVzdGFtcHMiLCJVc2VyIiwibW9kZWxzIiwibW9kZWwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./models/User.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fregister%2Froute&page=%2Fapi%2Fregister%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fregister%2Froute.ts&appDir=D%3A%5CBillboard%5Cunauth-biilboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CBillboard%5Cunauth-biilboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fregister%2Froute&page=%2Fapi%2Fregister%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fregister%2Froute.ts&appDir=D%3A%5CBillboard%5Cunauth-biilboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CBillboard%5Cunauth-biilboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Billboard_unauth_biilboard_app_api_register_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/register/route.ts */ \"(rsc)/./app/api/register/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/register/route\",\n        pathname: \"/api/register\",\n        filename: \"route\",\n        bundlePath: \"app/api/register/route\"\n    },\n    resolvedPagePath: \"D:\\\\Billboard\\\\unauth-biilboard\\\\app\\\\api\\\\register\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Billboard_unauth_biilboard_app_api_register_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZyZWdpc3RlciUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGcmVnaXN0ZXIlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZyZWdpc3RlciUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDQmlsbGJvYXJkJTVDdW5hdXRoLWJpaWxib2FyZCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q0JpbGxib2FyZCU1Q3VuYXV0aC1iaWlsYm9hcmQmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2E7QUFDMUY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXEJpbGxib2FyZFxcXFx1bmF1dGgtYmlpbGJvYXJkXFxcXGFwcFxcXFxhcGlcXFxccmVnaXN0ZXJcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3JlZ2lzdGVyL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcmVnaXN0ZXJcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3JlZ2lzdGVyL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcQmlsbGJvYXJkXFxcXHVuYXV0aC1iaWlsYm9hcmRcXFxcYXBwXFxcXGFwaVxcXFxyZWdpc3RlclxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fregister%2Froute&page=%2Fapi%2Fregister%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fregister%2Froute.ts&appDir=D%3A%5CBillboard%5Cunauth-biilboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CBillboard%5Cunauth-biilboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/bcryptjs"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fregister%2Froute&page=%2Fapi%2Fregister%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fregister%2Froute.ts&appDir=D%3A%5CBillboard%5Cunauth-biilboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CBillboard%5Cunauth-biilboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();