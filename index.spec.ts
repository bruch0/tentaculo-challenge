import fs from "fs";

import * as appFunctions from "./index";

describe("App", () => {
  const {
    getFileData,
    readFileData,
    validateFileData,
    getRoverDirection,
    registerMovements,
    bootstrap,
  } = appFunctions;

  describe("getFileData", () => {
    it("Should throw an error if the data provided is null", () => {
      jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => "");

      expect(getFileData).toThrow("Não há nenhum conteúdo no arquivo indicado");
    });

    it("Should throw an error if the data provided has no rovers data", () => {
      jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => "5 5");

      expect(getFileData).toThrow("Não há nenhuma sonda");
    });

    it("Should throw an error if the data provided has not enough rovers data", () => {
      jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => "5 5\n1 2 N");

      expect(getFileData).toThrow("Não há dados suficientes");
    });

    it("Should throw an error if the data provided has missing rovers data", () => {
      jest
        .spyOn(fs, "readFileSync")
        .mockImplementationOnce(() => "5 5\n 1 2 N\n LMLMLMLMM \n 3 3 E");

      expect(getFileData).toThrow(
        "Cada sonda precisa de uma posição inicial e uma instrução de movimentos"
      );
    });

    it("Should return an array of string if everything is ok with the provided data", () => {
      jest
        .spyOn(fs, "readFileSync")
        .mockImplementationOnce(() => "5 5\n 1 2 N\n LMLMLMLMM");

      const fileData = getFileData();
      expect(fileData).toEqual(["5 5", " 1 2 N", " LMLMLMLMM"]);
    });
  });

  describe("readFileData", () => {
    it("Should return all the properties as expected", () => {
      jest
        .spyOn(appFunctions, "getFileData")
        .mockImplementationOnce(() => ["5 5", " 1 2 N", " LMLMLMLMM"]);

      const { tableSize, roversData } = readFileData(getFileData());

      expect(tableSize).toEqual("5 5");
      expect(roversData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            initialPosition: "1 2 N",
            movement: "LMLMLMLMM",
          }),
        ])
      );
    });
  });

  describe("validateFileData", () => {
    it("Should throw an error if tableSize is not matching the regex", () => {
      expect(() => {
        validateFileData({ tableSize: "", roversData: [] });
      }).toThrow(
        "O tamanho da malha do planalto deve seguir o regex '/([0-9] [0-9])/'"
      );

      expect(() => {
        validateFileData({ tableSize: "1", roversData: [] });
      }).toThrow(
        "O tamanho da malha do planalto deve seguir o regex '/([0-9] [0-9])/'"
      );

      expect(() => {
        validateFileData({ tableSize: "1 ", roversData: [] });
      }).toThrow(
        "O tamanho da malha do planalto deve seguir o regex '/([0-9] [0-9])/'"
      );

      expect(() => {
        validateFileData({ tableSize: "1 B", roversData: [] });
      }).toThrow(
        "O tamanho da malha do planalto deve seguir o regex '/([0-9] [0-9])/'"
      );

      expect(() => {
        validateFileData({ tableSize: "B 1", roversData: [] });
      }).toThrow(
        "O tamanho da malha do planalto deve seguir o regex '/([0-9] [0-9])/'"
      );

      expect(() => {
        validateFileData({ tableSize: "B B", roversData: [] });
      }).toThrow(
        "O tamanho da malha do planalto deve seguir o regex '/([0-9] [0-9])/'"
      );
    });

    it("Should throw an error if initial rover position is not matching the regex", () => {
      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "", movement: "" }],
        });
      }).toThrow(
        "A posição inicial da sonda não está corretamente descrita, deve seguir o regex '/([0-9] [0-9] [NSEW])/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1", movement: "" }],
        });
      }).toThrow(
        "A posição inicial da sonda não está corretamente descrita, deve seguir o regex '/([0-9] [0-9] [NSEW])/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1 2", movement: "" }],
        });
      }).toThrow(
        "A posição inicial da sonda não está corretamente descrita, deve seguir o regex '/([0-9] [0-9] [NSEW])/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1 2 3", movement: "" }],
        });
      }).toThrow(
        "A posição inicial da sonda não está corretamente descrita, deve seguir o regex '/([0-9] [0-9] [NSEW])/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "N 2 3", movement: "" }],
        });
      }).toThrow(
        "A posição inicial da sonda não está corretamente descrita, deve seguir o regex '/([0-9] [0-9] [NSEW])/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "N B 3", movement: "" }],
        });
      }).toThrow(
        "A posição inicial da sonda não está corretamente descrita, deve seguir o regex '/([0-9] [0-9] [NSEW])/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "N B F", movement: "" }],
        });
      }).toThrow(
        "A posição inicial da sonda não está corretamente descrita, deve seguir o regex '/([0-9] [0-9] [NSEW])/'"
      );
    });

    it("Should throw an error if initial rover position is not inside the table", () => {
      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "6 2 N", movement: "" }],
        });
      }).toThrow(
        "A posição inicial horizontal da sonda não é válida, para a malha descrita, o valor deve ser entre 0 e 5"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1 6 N", movement: "" }],
        });
      }).toThrow(
        "A posição inicial vertical da sonda não é válida, para a malha descrita, o valor deve ser entre 0 e 5"
      );
    });

    it("Should throw an error if movement instructions is not matching the regex", () => {
      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1 2 N", movement: "!" }],
        });
      }).toThrow(
        "O movimento da sonda não está corretamente descrito, deve seguir o regex '/^([LRM])*$/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1 2 N", movement: "LMA" }],
        });
      }).toThrow(
        "O movimento da sonda não está corretamente descrito, deve seguir o regex '/^([LRM])*$/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1 2 N", movement: "LRB" }],
        });
      }).toThrow(
        "O movimento da sonda não está corretamente descrito, deve seguir o regex '/^([LRM])*$/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1 2 N", movement: "RMD" }],
        });
      }).toThrow(
        "O movimento da sonda não está corretamente descrito, deve seguir o regex '/^([LRM])*$/'"
      );

      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1 2 N", movement: "NRL" }],
        });
      }).toThrow(
        "O movimento da sonda não está corretamente descrito, deve seguir o regex '/^([LRM])*$/'"
      );
    });

    it("Should not throw an error if every parameter is correct", () => {
      expect(() => {
        validateFileData({
          tableSize: "5 5",
          roversData: [{ initialPosition: "1 2 N", movement: "LMLMLMLMM" }],
        });
      }).not.toThrow();
    });
  });

  describe("getRoverDirection", () => {
    it("Should throw an error if the string provided does not include a valid direction", () => {
      expect(() => {
        getRoverDirection("");
      }).toThrow("Posição inesperada");
    });

    it("Should not throw an error if the string provided include a valid direction", () => {
      const roverDirection = getRoverDirection("1 2 N");

      expect(roverDirection).toEqual("N");
    });
  });

  describe("registerMovements", () => {
    it("Should return the new rover position and direction", () => {
      jest.spyOn(global.console, "log");

      jest
        .spyOn(appFunctions, "getFileData")
        .mockImplementationOnce(() => ["5 5", " 1 2 N", " LMLMLMLMM"]);

      const { tableSize, roversData } = readFileData(getFileData());

      registerMovements({ roversData });

      expect(console.log).toHaveBeenCalledWith("1 3 N");
    });
  });

  describe("bootstrap", () => {
    it("Should run smoothly", () => {
      expect(() => {
        bootstrap();
      }).not.toThrow();
    });
  });
});
