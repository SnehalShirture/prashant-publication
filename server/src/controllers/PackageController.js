import { Package } from "../models/PackageSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";


const createPackage = async (req, res) => {
  try {

    const newPackage = await Package.create(req.body);
    res.status(201).json(new APiResponse(true, 200, newPackage, "Package created successfully"));
  } catch (error) {
    res.status(500).json(new APiResponse(false, 500, null, error.message));
  }
};


const getAllPackages = async (req, res) => {
  try {
    const allPackages = await Package.find()
    res.status(200).json(new APiResponse(true, 200, allPackages, "all packages"))
  } catch (error) {
    res.status(500).json(new APiResponse(false, 500, null, error.message))
  }
}


const updateAllPackagesPrice = async (req, res) => {
  try {
    const { price } = req.body;

    const result = await Package.updateMany(
      {},
      { $set: { "prices.$[].Price": price } } // Updates all elements in the prices array
    );

    res.status(200).json(new APiResponse(true, 200, result, "All package prices updated successfully"));
  } catch (error) {
    res.status(500).json(new APiResponse(false, 500, null, error.message));
  }
};


const getPackagesByCategory = async (req, res) => {
  try {
    const results = await Package.aggregate([
      {
        $project: {
          category: 1,
          academicYear: 1,
          firstPrice: { $arrayElemAt: ["$prices", 0] }
        }
      },
      {
        $group: {
          _id: { category: "$category", academicYear: "$academicYear" },
          price: { $first: "$firstPrice.Price" },
          maxReaders: { $first: "$firstPrice.maxReaders" }
        }
      },
      {
        $group: {
          _id: "$_id.category",
          academic: {
            $push: {
              year: "$_id.academicYear",
              price: "$price",
              maxReaders: "$maxReaders"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          academic: 1
        }
      }
    ]);

    res.status(200).json(new APiResponse(true, 200, results, "Packages By Category"));
  } catch (error) {
    res.status(500).json(new APiResponse(false, 500, null, error.message));
  }
};




export { createPackage, getAllPackages, updateAllPackagesPrice, getPackagesByCategory }