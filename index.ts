import fs from "fs";

const getFileData = (): string[] => {
  const fileData = fs.readFileSync("./data.txt", "utf-8").split("\n");

  if (fileData.length === 0)
    throw new Error("Não há nenhum conteúdo no arquivo indicado");

  if (fileData.length === 1) throw new Error("Não há nenhuma sonda");

  if (fileData.length < 3) throw new Error("Não há dados suficientes");

  return fileData;
};

const readFileData = (
  fileData: string[]
): {
  tableSize: string;
  roversData: { initialPosition: string; movement: string }[];
} => {
  const tableSize = fileData[0];
  const roversData: { initialPosition: string; movement: string }[] = [];

  const fileDataSanitized = fileData.slice(1);

  const roverDataSize = 2;
  for (let i = 0; i < fileDataSanitized.length; i += roverDataSize) {
    const roverData = fileDataSanitized.slice(i, i + roverDataSize);

    roversData.push({
      initialPosition: roverData[0],
      movement: roverData[1],
    });
  }

  return { tableSize, roversData };
};
