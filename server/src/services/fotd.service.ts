import axios from "axios";
import { WeatherDataType } from "../types/types";
import { generateDesc, getSeason } from "../utils";
import FragranceModel from "../models/fragrance.model";
import FotdModel from "../models/fotd.model";

export const resetFotd = async () => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${process.env.CURRENT_CITY}&appid=${process.env.OPEN_WEATHER_KEY}&units=metric`;
    const res = await axios.get(url);
    const weather: WeatherDataType = res.data;
    const temp = weather.main.temp;
    const season = getSeason(temp);
    const fragrance = await FragranceModel.aggregate([
      { $match: { season: season } },
      { $sample: { size: 1 } },
    ]);
    if (!fragrance[0]) {
      console.error("Fragrance not found while fetching in 'aggregate'.");
      return;
    }
    const desc = generateDesc(fragrance[0]);
    const fotd = await FotdModel.findOne();
    if (fotd) {
      fotd.fragrance = fragrance[0]._id;
      fotd.title = desc.title;
      fotd.text = desc.text;
      fotd.lastReset = Date.now();
      await fotd.save();
      console.log("Fotd was reset.");
      return;
    }
    const newFotd = new FotdModel({
      fragrance: fragrance[0]._id,
      title: desc.title,
      text: desc.text,
      lastReset: Date.now(),
    });
    await newFotd.save();
    console.log("Fotd was reset.");
  } catch (err) {
    console.error({
      message: "Something went wrong while resetting fotd.",
      error: err,
    });
  }
};
