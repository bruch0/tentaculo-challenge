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

const validateFileData = ({
  tableSize,
  roversData,
}: {
  tableSize: string;
  roversData: { initialPosition: string; movement: string }[];
}) => {
  const validTableSize = /([0-9] [0-9])/.test(tableSize);

  if (!validTableSize)
    throw new Error(
      "O tamanho da malha do planalto deve seguir o regex '/([0-9] [0-9])/'"
    );

  const maxTableX = Number(tableSize[0]);
  const maxTableY = Number(tableSize[2]);

  roversData.map((roverData) => {
    const roverPosition = roverData.initialPosition;

    const validRoverPosition = /([0-9] [0-9] [NSEW])/.test(roverPosition);
    if (!validRoverPosition)
      throw new Error(
        "A posição inicial da sonda não está corretamente descrita, deve seguir o regex '/([0-9] [0-9] [NSEW])/'"
      );

    const roverPositionX = Number(roverPosition[0]);
    const roverPositionY = Number(roverPosition[2]);

    if (roverPositionX > maxTableX || roverPositionX < 0)
      throw new Error(
        `A posição inicial horizontal da sonda não é válida, para a malha descrita, o valor deve ser entre 0 e ${maxTableX}`
      );

    if (roverPositionY > maxTableY || roverPositionY < 0)
      throw new Error(
        `A posição inicial vertical da sonda não é válida, para a malha descrita, o valor deve ser entre 0 e ${maxTableY}`
      );

    const validRoverMovement = /^([LRM])*$/.test(roverData.movement);
    if (!validRoverMovement)
      throw new Error(
        "O movimento da sonda não está corretamente descrito, deve seguir o regex '/^([LRM])*$/'"
      );
  });
};
