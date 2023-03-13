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

const getRoverDirection = (roverPositon: string): "W" | "N" | "S" | "E" => {
  const roverDirection = roverPositon[4];

  if (
    roverDirection !== "N" &&
    roverDirection !== "W" &&
    roverDirection !== "S" &&
    roverDirection !== "E"
  ) {
    throw new Error("Posição inesperada");
  }

  return roverDirection;
};

const registerMovements = ({
  roversData,
}: {
  roversData: { initialPosition: string; movement: string }[];
}) => {
  const movementCase = {
    E: {
      left: "N",
      right: "S",
      move: (position: "X" | "Y") => (position === "X" ? 1 : 0),
    },
    W: {
      left: "S",
      right: "N",
      move: (position: "X" | "Y") => (position === "X" ? -1 : 0),
    },
    N: {
      left: "W",
      right: "E",
      move: (position: "X" | "Y") => (position === "X" ? 0 : 1),
    },
    S: {
      left: "E",
      right: "W",
      move: (position: "X" | "Y") => (position === "X" ? 0 : -1),
    },
  };

  roversData.map((rover) => {
    let position = rover.initialPosition;

    rover.movement.split("").map((movement) => {
      const roverPositionX = Number(position[0]);
      const roverPositionY = Number(position[2]);
      const roverDirection = getRoverDirection(position);

      if (movement === "L")
        position = `${roverPositionX} ${roverPositionY} ${movementCase[roverDirection].left}`;

      if (movement === "R")
        position = `${roverPositionX} ${roverPositionY} ${movementCase[roverDirection].right}`;

      if (movement === "M")
        position = `${
          roverPositionX + movementCase[roverDirection].move("X")
        } ${
          roverPositionY + movementCase[roverDirection].move("Y")
        } ${roverDirection}`;
    });

    console.log(position);
  });
};

validateFileData(readFileData(getFileData()));
registerMovements(readFileData(getFileData()));
