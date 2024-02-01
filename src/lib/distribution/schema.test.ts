import { describe, it, expect } from "bun:test";
import Distributions from "../../fixtures/Distributions.json";

import { zDistributionEndpointSchema } from "./schema";

describe("schema", () => {
  it("should parse Distributions", () => {
    const parsed = zDistributionEndpointSchema.parse(Distributions);
    expect(parsed).toBeDefined();
  });
});
