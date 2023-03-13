import fs from "fs";

const getFileData = (): string[] => {
  const fileData = fs.readFileSync("./data.txt", "utf-8").split("\n");

  if (fileData.length === 0)
    throw new Error("Não há nenhum conteúdo no arquivo indicado");

  if (fileData.length === 1) throw new Error("Não há nenhuma sonda");

  if (fileData.length < 3) throw new Error("Não há dados suficientes");

  return fileData;
};
