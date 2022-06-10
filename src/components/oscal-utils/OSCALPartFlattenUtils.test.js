import flattenNestedPartsToList from "./OSCALPartFlattenUtils";

describe("part flattening", () => {
  it("should return a list of a single item when no part", async () => {
    expect(flattenNestedPartsToList({})).toEqual([{}]);
    expect(flattenNestedPartsToList({ foo: "bar" })).toEqual([{ foo: "bar" }]);
  });

  it("should include the root object when there are parts", async () => {
    const innerObject = { key: "inner" };
    const parentObject = { key: "outer", parts: [innerObject] };
    expect(flattenNestedPartsToList(parentObject)).toContain(parentObject);
  });

  it("should include the inner object when there is a part", async () => {
    const innerObject = { key: "inner" };
    const parentObject = { key: "outer", parts: [innerObject] };
    expect(flattenNestedPartsToList(parentObject)).toContain(innerObject);
  });

  it("should return objects embedded several levels of parts", async () => {
    const innerMostObject = { key: "allTheWay" };
    const parent = {
      key: "0",
      parts: [{ key: "1", parts: [{ key: "2", parts: [innerMostObject] }] }],
    };
    expect(flattenNestedPartsToList(parent)).toContain(innerMostObject);
  });

  it("should handle a real example from FedRAMP Moderate profile", async () => {
    expect(
      flattenNestedPartsToList({
        position: "ending",
        "by-id": "ac-2.10_smt",
        parts: [
          {
            id: "ac-2.10_fr",
            name: "item",
            title: "AC-2 (10) Additional FedRAMP Requirements and Guidance",
            parts: [
              {
                id: "ac-2.10_fr_smt.1",
                name: "item",
                props: [
                  {
                    name: "label",
                    value: "Requirement:",
                  },
                ],
                prose: "Required if shared/group accounts are deployed",
              },
            ],
          },
        ],
      })
    ).toEqual([
      {
        id: "ac-2.10_fr_smt.1",
        name: "item",
        props: [
          {
            name: "label",
            value: "Requirement:",
          },
        ],
        prose: "Required if shared/group accounts are deployed",
      },
      {
        position: "ending",
        "by-id": "ac-2.10_smt",
        parts: [
          {
            id: "ac-2.10_fr",
            name: "item",
            title: "AC-2 (10) Additional FedRAMP Requirements and Guidance",
            parts: [
              {
                id: "ac-2.10_fr_smt.1",
                name: "item",
                props: [
                  {
                    name: "label",
                    value: "Requirement:",
                  },
                ],
                prose: "Required if shared/group accounts are deployed",
              },
            ],
          },
        ],
      },
    ]);
  });
});
