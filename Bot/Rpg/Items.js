/*
item: {
    id:
    name:
    quanity:
    type: [Item, material]
    quality:
}
*/

const pelt = {
  id: 1,
  name: "Pelt",
  type: "material",
  quality: "normal",
  quanity: 1,
};

const sharptooth = {
  id: 3,
  name: "Sharp Tooth",
  type: "material",
  quality: "normal",
  quanity: 1,
};

const furarmor = {
  id: 2,
  name: "Fur Armor",
  type: "crafteditem",
  mats: [
    { ...pelt, quanity: 3 },
    { ...sharptooth, quanity: 5 },
  ],
};

const dic = { pelt, furarmor, sharptooth };
module.exports = dic;
