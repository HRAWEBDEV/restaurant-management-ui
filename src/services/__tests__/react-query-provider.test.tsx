import { describe, expect, it } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryProvider } from "../react-query-provider";

function Probe() {
  const query = useQuery({
    queryKey: ["probe"],
    queryFn: () => "works",
  });

  return <span data-testid="probe">{query.data ?? "pending"}</span>;
}

describe("ReactQueryProvider", () => {
  it("provides a query client to children", async () => {
    const { getByTestId } = render(
      <ReactQueryProvider>
        <Probe />
      </ReactQueryProvider>
    );

    await waitFor(() =>
      expect(getByTestId("probe").textContent).toBe("works")
    );
  });
});
