// (C) 2007-2019 GoodData Corporation

import { IPivotTableProps, PivotTable } from "@gooddata/sdk-ui";
import { scenariosFor } from "../../src";
import { PivotTableWithSingleMeasureAndTwoRowsAndCols } from "./base";
import { GermanNumberFormat } from "../_infra/formatting";
import { modifyMeasure } from "@gooddata/sdk-model";
import { ReferenceLdm } from "@gooddata/reference-workspace";
import { PivotTableWithTwoMeasuresAndTotals } from "./totals";

const MeasureWithCustomFormat = modifyMeasure(ReferenceLdm.Amount, m =>
    m.format("[backgroundColor=ffff00][green]#,##0.00 €"),
);

export default scenariosFor<IPivotTableProps>("PivotTable", PivotTable)
    .withVisualTestConfig({ screenshotSize: { width: 1000, height: 800 } })
    .withDefaultTags("vis-config-only", "mock-no-scenario-meta")
    .addScenario("german number format", {
        ...PivotTableWithSingleMeasureAndTwoRowsAndCols,
        config: {
            separators: GermanNumberFormat,
        },
    })
    .addScenario("no totals and max height 200", {
        ...PivotTableWithSingleMeasureAndTwoRowsAndCols,
        config: {
            maxHeight: 200,
        },
    })
    .addScenario("no totals and max height 300", {
        ...PivotTableWithSingleMeasureAndTwoRowsAndCols,
        config: {
            maxHeight: 300,
        },
    })
    .addScenario("no totals and no grouping", {
        ...PivotTableWithSingleMeasureAndTwoRowsAndCols,
        groupRows: false,
    })
    .addScenario(
        "measure format with colors",
        {
            ...PivotTableWithSingleMeasureAndTwoRowsAndCols,
            measures: [MeasureWithCustomFormat],
            groupRows: false,
        },
        m => {
            // measure formatting needs to be looped through backend.. thus clearing up the vis-config-only flag to
            // make sure recording will be captured
            return m.withTags("mock-no-scenario-meta");
        },
    )
    .addScenario("totals and max height 200", {
        ...PivotTableWithTwoMeasuresAndTotals,
        config: {
            maxHeight: 200,
        },
    })
    .addScenario("totals and max height 300", {
        ...PivotTableWithTwoMeasuresAndTotals,
        config: {
            maxHeight: 300,
        },
    });