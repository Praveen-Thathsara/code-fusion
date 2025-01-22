import User from "../models/user.js";
import userRepository from "../repositories/userRepository.js";
import HttpStatus from "../enums/httpStatus.js";
import error from "../middleware/error.js";
import rentalController from "./rentalController.js";

const user = new User(null, null, null, null, null, null);

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, isAdmin } = req.body;
  user.id = id;
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.isAdmin = isAdmin;
  const resultValidation = user.validate();
  if (resultValidation.error)
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(resultValidation.error.details[0].message);
  try {
    const result = await userRepository.updateUser(user);
    if (result.length == 0) {
      // res.status(HttpStatus.BAD_REQUEST).json({ message: "User not updated" });
      error(result, res);
    } else {
      res
        .status(HttpStatus.OK)
        .json({ message: "User updated successfully", data: result });
    }
  } catch (error) {
    res.json({
      message: "User not updated",
      error: error.message,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

const getUser = async (req, res) => {
  const id = req.params.id;
  user.id = id;
  const validateErrMsg = user.validateId();
  if (validateErrMsg)
    return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);
  try {
    const result = await userRepository.getUserById(id);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    } 
    return res.status(HttpStatus.OK).json({ data: result });
    
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error ocurred" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  user.id = id;
  const validateErrMsg = user.validateId();
  if (validateErrMsg)
    return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);
  try {
    const result = await userRepository.deleteUser(id);
    if (result.length == 0) {
      error(result, res);
    } else {
      res
        .status(HttpStatus.OK)
        .json({ data: result, message: "User deleted successfully" });
    }
  } catch (error) {
    res.json({
      message: "User not deleted",
      error: error,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await userRepository.getAllUsers();
    if (result.length == 0) {
      error(result, res);
    } else {
      res.status(HttpStatus.OK).json({ data: result });
    }
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error ocurred" });
  }
};

const getAllUserEmails = async (req, res) => {
  try {
    let result = await userRepository.getAllUsers();
    result = result.map((user) => user.email);
    if (result.length == 0) {
      error(result, res);
    } else {
      res.status(HttpStatus.OK).json({ data: result });
    }
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error ocurred" });
  }
}
const addBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const amount = req.body.amount;

    const user = await userRepository.getUserById(userId);
    if(!user) res.status(HttpStatus.NOT_FOUND).json({message: "User not found"});

    const newBalance = user.balance + amount;
    const response = await userRepository.updateUserBalance(userId, newBalance);

    return res.status(HttpStatus.OK).json({ data: response });

  } catch (error) {
    console.log(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error ocurred" });
  }
}

//challenge 12.a part 2 starts here
const euclideanDistance = (point1, point2) => {
  return Math.sqrt(
    point1.reduce((acc, cur, i) => acc + Math.pow(cur - point2[i], 2), 0)
  );
};

const kmeansPlusPlus = (userPoints, k) => {
  let centroids = [];
  let distances = Array(userPoints.length).fill(Infinity);
  let points = userPoints.map((userPoint) => userPoint.point[0])

  centroids.push(
    userPoints[points.indexOf(Math.min(...userPoints.map((userPoint) => userPoint.point[0])))].point
  );
  return centroids;
};

const getUserGroups = async (req, res) => {
  try {
    const k = 3;
    const users = await userRepository.getAllUsers();

    const userPoints = [];
    for (let user of users) {
      userPoints.push(
        await rentalController.getUserRentSummary(
          user.id
        )
      );
    }

    let centroids = kmeansPlusPlus(userPoints, k);

    let assignment = assignCluster(userPoints, centroids);

    let iterations = 0;
    let maxIterations = 100;

    while (iterations < maxIterations) {
      const newCentroids = calculateCentroids(userPoints, assignment, k);

      if (arrayEqual(newCentroids, centroids)) {
        break;
      }
      centroids = newCentroids;
      assignment = assignCluster(userPoints, centroids);
      iterations++;
    }

    centroids = centroids.map((centroid, i) => [i, ...centroid]);

    centroids = centroids.sort((a, b) => a[1] - b[1]);

    assignment = assignment.map((cluster, i) => {
      return {
        user: users[i].id,
        group:
          cluster === centroids[0][0]
            ? "Bronze Renters"
            : cluster === centroids[1][0]
            ? "Silver Renters"
            : "Gold Renters ",
      };
    });

    centroids = centroids.slice(0, 3).map((centroid) => centroid.slice(1));

    return res.status(HttpStatus.OK).json({ data: { centroids, assignment } });
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "An error ocurred" });
  }
};

const assignCluster = (userPoints, centroids) => {
  return userPoints.map((userPoint) => {
    let distances = centroids.map((centroid) =>
      euclideanDistance(userPoint.point, centroid)
    );
    return distances.indexOf(Math.min(...distances));
  });
};

const calculateCentroids = (userPoints, assignment, k) => {
  let newCentroids = Array.from({ length: k }, () =>
    Array(userPoints[0].point.length).fill(0)
  );
  const NoOfPointsInClusters = Array(k).fill(0);

  for (let i = 0; i < userPoints.length; i++) {
    const cluster = assignment[i];
    NoOfPointsInClusters[cluster]++;

    for (let j = 0; j < userPoints[i].point.length; j++) {
      newCentroids[cluster][j] += userPoints[i].point[j];
    }
  }

  for (let i = 0; i < k; i++) {
    if (NoOfPointsInClusters[i] > 0) {
      for (let j = 0; j < newCentroids[i].length; j++) {
        newCentroids[i][j] /= NoOfPointsInClusters[i];
      }
    }
  }
  return newCentroids;
};

const arrayEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j]) return false;
    }
  }
  return true;
};
//challenge 12.a part 2 ends here

export default {
  updateUser,
  getUser,
  deleteUser,
  getAllUsers,
  getAllUserEmails,
  getUserGroups,
  addBalance
};
