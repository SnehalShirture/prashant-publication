import { Payment } from "../models/PaymentSchema.js";
import { Subscription } from "../models/SubscriptionSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import mongoose from "mongoose";
import { sendMessage } from "../middleware/MessageMiddleware.js";

import PDFDocument from "pdfkit"
import PdfPrinter from "pdfmake"
import fs from "fs"
import path from "path";


const fontsPath = path.resolve(process.cwd(), "../server/fonts/static");

["NotoSans-Regular.ttf", "NotoSans-Bold.ttf", "NotoSans-Italic.ttf", "NotoSans-BoldItalic.ttf"].forEach(file => {
    const filePath = path.join(fontsPath, file);
    if (!fs.existsSync(filePath)) {
        console.error(`Font file missing: ${filePath}`);
    }
});

const printer = new PdfPrinter({
    NotoSans: {
        normal: path.join(fontsPath, "NotoSans-Regular.ttf"),
        bold: path.join(fontsPath, "NotoSans-Bold.ttf"),
        italics: path.join(fontsPath, "NotoSans-Italic.ttf"),
        bolditalics: path.join(fontsPath, "NotoSans-BoldItalic.ttf"),
    },
});

const cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        const subscription = await Subscription.findOneAndUpdate(
            { _id: subscriptionId, isActive: true },
            { isActive: false },
            { new: true }
        );

        if (!subscription) {
            throw new ApiError("Subscription not found or already canceled.", 404);
        }

        res.status(200).json(new APiResponse(true, 200, subscription, "Subscription canceled successfully."));
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json(new APiResponse(false, status, null, error.message || "An error occurred."));
    }
};


const createSubscription = async (req, res) => {
    try {
        //collegeId,package,totalAmount

        const subscription = await Subscription.create(req.body)

        res.status(200).json(new APiResponse(true, 200, subscription, "Subscription created successfully."));

    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message))
    }
}


const removeBooksFromSubscription = async (req, res) => {
    try {
        const { subscriptionId, subscribedBooks } = req.body;

        const subscription = await Subscription.findOneAndUpdate(
            { _id: subscriptionId },
            { $pull: { subscribedBooks: { $in: subscribedBooks } } },
            { new: true }
        );

        if (!subscription) {
            throw new ApiError("Subscription not found", 404)
        }
        res.status(200).json(new APiResponse(true, 200, subscription, "books removed successfully"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const getBooksByCollegeId = async (req, res) => {
    try {
        const { collegeId } = req.body;

        const subscriptions = await Subscription.aggregate([
            { $match: { collegeId: new mongoose.Types.ObjectId(collegeId) } },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $addFields: {
                    books: {
                        $map: {
                            input: "$books",
                            as: "book",
                            in: {
                                _id: "$$book._id",
                                name: "$$book.name",
                                author: "$$book.author",
                                category: "$$book.category",
                                price: "$$book.price",
                                publisher: "$$book.publisher",
                                otherPublisher: "$$book.otherPublisher",
                                yearPublished: "$$book.yearPublished",
                                coverImage: "$$book.coverImage",
                                indexImage1: "$$book.indexImage1",
                                indexImage2: "$$book.indexImage2",
                                bookPdf: { $cond: { if: "$isActive", then: "$$book.bookPdf", else: "$$REMOVE" } } // Remove bookPdf if isActive is false
                            }
                        }
                    }
                }
            },
            { $project: { subscribedBooks: 0 } }
        ]);

        const books = subscriptions.flatMap(sub => sub.books);

        res.status(200).json(new APiResponse(true, 200, books, "Books retrieved successfully"));
    } catch (error) {

        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const updateSubscriptionStatus = async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        const startDate = new Date();
        let endDate = new Date(startDate);

        endDate.setFullYear(endDate.getFullYear() + 1);

        const subscription = await Subscription.findOneAndUpdate(
            { _id: subscriptionId },
            {
                status: "approved",
                startDate,
                endDate,
                isActive: true,
                plan: "1year",

            },
            { new: true }
        );

        if (!subscription) {
            throw new ApiError("Subscription not found", 404)
        }

        res.status(200).json(new APiResponse(true, 200, subscription, "Subscription updated Successfully"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const getAllSubscription = async (req, res) => {
    try {
        const subscriptions = await Subscription.aggregate([
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $lookup: {
                    from: "packages",
                    localField: "package",
                    foreignField: "_id",
                    as: "package"
                }
            },
            {
                $addFields: {
                    totalBooks: { $size: "$books" }
                }
            },
            {
                $sort: { startDate: -1 }
            },

            {
                $project: {
                    subscribedBooks: 0,
                }
            }
        ]);

        res.status(200).json(new APiResponse(true, 200, subscriptions, "Fetched All Subscriptions"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const getActiveSubscription = async (req, res) => {
    try {
        const subscriptions = await Subscription.aggregate([
            {
                $match: {
                    isActive: true,
                    endDate: { $gte: new Date() }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },
            {
                $addFields: {
                    bookCount: { $size: "$books" }
                }
            },
            {
                $project: {
                    "user.password": 0,
                    "user.__v": 0,
                    "user.otp": 0,
                    "user.otpExpires": 0,
                    "user.bookShelf": 0,
                    "user.totalRevenue": 0,
                    subscribedBooks: 0,
                    __v: 0
                }
            }
        ]);

        if (!subscriptions.length) {
            return res.status(404).json(new APiResponse(false, 404, null, "No active subscriptions found."));
        }

        res.status(200).json(new APiResponse(true, 200, subscriptions, "Active subscriptions fetched successfully."));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message || "An error occurred."));
    }
};


const getSubscriptionsByStatus = async (req, res) => {
    try {
        const subscription = await Subscription.aggregate([
            { $match: req.body },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },
            {
                $addFields: {
                    bookCount: { $size: "$books" }
                }
            },
            {
                $project: {
                    "user.password": 0,
                    "user.otp": 0,
                    "user.otpExpires": 0,
                    "user.__v": 0,
                    "college.__v": 0,
                    subscribedBooks: 0,
                    __v: 0
                }
            }
        ]);
        res.status(200).json(new APiResponse(true, 200, subscription, " subscriptions fetched successfully."));

    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message || "An error occurred."));

    }
}


const getExpiredSubscription = async (req, res) => {
    try {
        const expiredSubscriptions = await Subscription.aggregate([
            {
                $match: {
                    endDate: { $lt: new Date() }
                }
            },
            {
                $set: {
                    isActive: false
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },
            {
                $addFields: {
                    bookCount: { $size: "$books" }
                }
            },
            {
                $project: {
                    "user.password": 0,
                    "user.otp": 0,
                    "user.otpExpires": 0,
                    "user.__v": 0,
                    "college.__v": 0,
                    subscribedBooks: 0,
                    __v: 0
                }
            }
        ]);

        res.status(200).json(new APiResponse(true, 200, expiredSubscriptions, "Expired subscriptions fetched successfully."));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message || "An error occurred."));
    }
};


const fetchBooksByCollegeId = async (req, res) => {
    try {
        const collegeId = req.body.collegeId;
        const booksData = await Subscription.aggregate([
            { $match: { collegeId: new mongoose.Types.ObjectId(collegeId) } },
            {
                $lookup: {
                    from: "packages",
                    localField: "package",
                    foreignField: "_id",
                    as: "packageDetails"
                }
            },
            {
                $unwind: "$packageDetails"
            },
            {
                $lookup: {
                    from: "books",
                    localField: "packageDetails.booksIncluded",
                    foreignField: "_id",
                    as: "packageBooks"
                }
            },
            {
                $unwind: "$packageBooks"
            },
            // {
            //     $match: { "packageBooks.type": "textbook" }
            // },
            {
                $group: {
                    _id: null,
                    books: { $addToSet: "$packageBooks" }
                }
            },
            {
                $project: {
                    _id: 0,
                    books: 1
                }
            }
        ]);
        res.status(200).json(new APiResponse(true, 200, booksData, "Books Data"))
    } catch (error) {
        console.log(error);
    }
}


const getSubscriptionByCollegeId = async (req, res) => {
    try {
        const { collegeId } = req.body;

        const subscriptions = await Subscription.aggregate([
            {
                $match: { collegeId: new mongoose.Types.ObjectId(collegeId) }
            },
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },

            {
                $lookup: {
                    from: "packages",
                    localField: "package",
                    foreignField: "_id",
                    as: "package"
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $addFields: {
                    totalBooks: { $size: "$books" }
                }
            },
            {
                $project: {
                    subscribedBooks: 0, // Exclude the subscribedBooks array
                }
            }
        ]);

        if (!subscriptions.length) {
            return res.status(404).json(new APiResponse(false, 404, null, "No subscriptions found for this college"));
        }
        res.status(200).json(new APiResponse(true, 200, subscriptions, "Fetched Subscriptions for College"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }


}

export const generateQuotationpdf = async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        const subscription = await Subscription.findById(subscriptionId)
            .populate("_id")
            .populate("collegeId")
            .populate("package")
            .populate("subscribedBooks")
            .lean();

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }


        const folderPath = path.join("uploads", "quotations");
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Define file path
        const pdfFilePath = path.join(folderPath, `quotation_${subscriptionId}.pdf`).replace(/\\/g, "/");

        // Header Section 
        const headerSection = {
            columns: [
                {
                    stack: [
                        { text: "Prashant Book House", style: "header", alignment: "center" },
                        { text: "Office: 3 Pratap Nagar, Dynaneshwar Mandir Road,", fontSize: 10, alignment: "center", margin: [0, 2] },
                        { text: "Near Nutan Maratha College Jalgaon 425 001,", fontSize: 10, alignment: "center", margin: [0, 2] },
                        { text: "Ph: (0257) 223 5520, 223 2800 | Mb: 9421636460", fontSize: 10, alignment: "center", margin: [0, 2] },
                        { text: "Email: prashantbookhouse@gmail.com", fontSize: 10, alignment: "center", margin: [0, 2] },
                        { text: "Website: prashantpublications.com", fontSize: 10, alignment: "center", margin: [0, 2] },
                    ],
                    width: "60%",
                },
                {
                    stack: [
                        { text: "To,", bold: true, alignment: "left" },
                        { text: `${subscription.collegeId.clgName}`, style: "subheader", alignment: "left", margin: [0, 2] },
                        { text: `${subscription.collegeId.clgAddress}`, fontSize: 10, alignment: "left", margin: [0, 2] },
                        { text: `Librarian: ${subscription.collegeId.librarianName}`, fontSize: 10, alignment: "left", margin: [0, 2] },
                        { text: `Email: ${subscription.collegeId.librarianEmail}`, fontSize: 10, alignment: "left", margin: [0, 2] },
                        { text: `Mobile: ${subscription.collegeId.librarianMobile}`, fontSize: 10, alignment: "left", margin: [0, 2] },
                    ],
                    alignment: "right",
                    width: "50%",
                },
            ],
            margin: [0, 15, 0, 7],
        };

        const orderTitle = {
            table: {
                widths: ["100%"],
                body: [
                    [
                        {
                            text: "Q U O T A T I O N   F O R M",
                            style: "orderHeader",
                            alignment: "center",
                            bold: true,
                            margin: [0, 3, 0, 3],
                            fillColor: "#e0e0e0", // Light Grey Background
                        },
                    ],
                ],
            },
            layout: "noBorders",
            margin: [0, 7, 0, 7],
        };


        const orderDate = {
            columns: [
                { text: `Date: ${new Date().toLocaleDateString()}`, alignment: "left", margin: [0, 0, 0, 6], },
            ],
        };

        // **Subscription Details
        // Define pricing based on max readers
        const readerPrices = { 5: 2000, 10: 2500, 15: 3000, 20: 3500 };
        const packagePrice = readerPrices[subscription.maxReaders] || 0;
        const subscriptionDetailsBody = [
            [{ text: "Subscription Details", style: "subheader", colSpan: 2, fillColor: "#f3f3f3" }, {}],
            [{ text: "Active:", bold: true }, { text: subscription.isActive ? "Yes" : "No" }],
            [{ text: "Max Readers:", bold: true }, { text: subscription.maxReaders }],
            [{ text: "Total Amount:", bold: true }, { text: ` ₹ ${subscription.totalAmount}` }],
        ];

        // Add Start Date & End Date only if subscription is active
        if (subscription.isActive) {
            subscriptionDetailsBody.splice(2, 0, // Insert after "Active" field
                [{ text: "Start Date:", bold: true }, { text: new Date(subscription.startDate).toDateString() }],
                [{ text: "End Date:", bold: true }, { text: new Date(subscription.endDate).toDateString() }]
            );
        }

        const subscriptionDetails = {
            table: {
                widths: ["30%", "70%"], // Adjusted column width for better alignment
                body: subscriptionDetailsBody,
            },
            layout: "lightHorizontalLines",
            margin: [0, 12, 0, 12], // Adds spacing before and after the section
        };


        let packageTable = { text: "No Packages Available", style: "content", margin: [0, 8, 0, 8] };
        let totalAmount = 0;
        if (subscription.package.length > 0) {
            packageTable = {
                table: {
                    headerRows: 1,
                    widths: ["15%", "25%", "30%", "30%"],
                    body: [
                        [{ text: "S.No", style: "tableHeader" },
                        { text: "Academic Year", style: "tableHeader" },
                        { text: "Category", style: "tableHeader" },
                        { text: "Price (₹)", style: "tableHeader" }]
                    ],
                },
                margin: [0, 8, 0, 8],
            };

            subscription.package.forEach((pkg, index) => {
                totalAmount += packagePrice;

                packageTable.table.body.push([
                    index + 1,
                    pkg.academicYear,
                    pkg.category,
                    `₹${packagePrice}`
                ]);
            });

            const maintenanceCost = subscription.maintenanceCost || 0;
            const finalAmount = totalAmount + maintenanceCost;
            packageTable.table.body.push(
                [{ text: "Total", bold: true, colSpan: 3, alignment: "right" }, {}, {}, { text: `₹${totalAmount}`, alignment: "left" }],
                [{ text: "Maintenance Cost", bold: true, colSpan: 3, alignment: "right" }, {}, {}, { text: `₹${maintenanceCost}`, alignment: "left" }],
                [{ text: "Final Amount", bold: true, colSpan: 3, alignment: "right" }, {}, {}, { text: `₹${finalAmount}`, alignment: "left" }]
            );
        }

        const stampFilePath = path.resolve(process.cwd(), "../public/stamp.png");
        let stampBase64 = "";
        if (fs.existsSync(stampFilePath)) {
            const imageBuffer = fs.readFileSync(stampFilePath);
            stampBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
        }

        const stampSection = stampBase64
            ? {
                image: stampBase64, // Use Base64 instead of file path
                width: 150,
                height: 100,
                alignment: "right",
                margin: [0, 30, 0, 0],
            }
            : { text: "Stamp not available", alignment: "right", margin: [0, 30, 0, 0] };


        //Document Definition
        const docDefinition = {
            content: [
                headerSection,
                orderTitle,
                orderDate,
                subscriptionDetails,
                { text: "Package Details", style: "subheader", fillColor: "#f3f3f3", margin: [0, 7, 0, 3] },
                packageTable,
                stampSection,

            ],
            styles: {
                header: { font: "NotoSans", fontSize: 16, bold: true, margin: [0, 3, 0, 7] },
                subheader: { font: "NotoSans", fontSize: 14, margin: [0, 0, 0, 7] },
                orderHeader: { font: "NotoSans", fontSize: 16, bold: true, alignment: "center", margin: [0, 3, 0, 7] },
                tableHeader: { font: "NotoSans", bold: true, fontSize: 12, fillColor: "#f3f3f3" },
                content: { font: "NotoSans", fontSize: 12, margin: [0, 5, 0, 5] },
            },
            defaultStyle: {
                font: "NotoSans"
            }
        };

        //generate and save pdf
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const writeStream = fs.createWriteStream(pdfFilePath);
        pdfDoc.pipe(writeStream);

        // Finalize PDF
        pdfDoc.end();
        writeStream.on("finish", async () => {
            await Subscription.findByIdAndUpdate(subscriptionId, {
                subscriptionQuotation: pdfFilePath
            }, { new: true });

            //send quotation
            const message = "your Quotation is : ";
            await sendMessage(subscription.collegeId.librarianEmail, message, pdfFilePath)
            res.json({ message: "PDF generated successfully", pdfUrl: pdfFilePath });
        });
    } catch (error) {
        console.error("Error generating PDF:", error.message);
    }
}


export {
    getActiveSubscription, createSubscription, cancelSubscription, getAllSubscription, updateSubscriptionStatus,
    getBooksByCollegeId, removeBooksFromSubscription, getSubscriptionsByStatus, getExpiredSubscription, fetchBooksByCollegeId,
    getSubscriptionByCollegeId
}
