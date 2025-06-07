import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser'
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDb.js';
import departmentJobRoutes from './route/departmentJobRoutes.js'
import imageSliderRoutes from './route/imageSliderRoutes.js'
import recentJobNewsRoutes from './route/recentJobNewsRoutes.js'
import skillDevelopmentRoutes from './route/skillDevelopment.routes.js'
import stateCertificatesRoutes from "./route/stateCertificatesRoutes.js";
import authRoutes from './route/authRoutes.js'
import complaintsRoutes from "./route/complaintsRoutes.js";
import contactUsRoutes from "./route/contactUsRoutes.js";
import aidedRoutes from "./route/aidedDepartmentRoutes.js";
import govtDepartmentRoutes from "./route/govtDepartmentRoutes.js";
import publicUndertakingRoutes from "./route/publicUndertaking.routes.js";
import departmentRoutes from "./route/departments.routes.js";
import aboutUsRoutes from "./route/aboutUsRoutes.js";
import siteSettingRoutes from "./route/siteSettingRoutes.js";
import jobCountRoutes from "./route/jobCountRoutes.js";
import userRoutes from "./route/userRoutes.js";
import generalRoutes from './route/generalRoutes.js';
import socialGalleryRoutes from './route/socialGalleryRoutes.js'

const app = express();
app.use(cors());
app.options('*', cors())


app.use(express.json())
app.use(cookieParser())
// app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false
}))


app.get("/", (request, response) => {
    ///server to client
    response.json({
        message: "Server is running " + process.env.PORT
    })
})


// app.use('/api/user',userRouter)
// app.use('/api/category',categoryRouter)
// app.use('/api/product',productRouter);
// app.use("/api/cart",cartRouter)
// app.use("/api/myList",myListRouter)
// app.use("/api/address",addressRouter)
// app.use("/api/homeSlides",homeSlidesRouter)
// app.use("/api/bannerV1",bannerV1Router)
// app.use("/api/bannerList2",bannerList2Router)
// app.use("/api/blog",blogRouter)
// app.use("/api/order",orderRouter)
// app.use("/api/logo",logoRouter)
app.use("/api", generalRoutes);
app.use("/api/department-jobs", departmentJobRoutes);
app.use("/api/image-sliders", imageSliderRoutes);
app.use("/api/recent-job-news", recentJobNewsRoutes);
app.use("/api/skill-development", skillDevelopmentRoutes);
app.use("/api/state-certificates", stateCertificatesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/contact-us", contactUsRoutes);
app.use("/api/departments/aided", aidedRoutes);
app.use("/api/departments/govt", govtDepartmentRoutes);
app.use("/api/departments/public", publicUndertakingRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/about-us", aboutUsRoutes)
app.use("/api/site-setting", siteSettingRoutes);
app.use("/api/get-job-counts", jobCountRoutes);
app.use("/api/socialImages", socialGalleryRoutes);
app.use("/api/user", userRoutes);


connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running", process.env.PORT);
    })
})