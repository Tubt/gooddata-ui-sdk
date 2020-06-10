// (C) 2019-2020 GoodData Corporation
import {
    DataValue,
    IResultHeader,
    IDimensionDescriptor,
    isAttributeDescriptor,
    IDimensionItemDescriptor,
} from "@gooddata/sdk-backend-spi";
import { Execution, AttributeGranularityResourceAttribute } from "@gooddata/gd-tiger-client";
import isResultAttributeHeader = Execution.isResultAttributeHeader;
import isResultMeasureHeader = Execution.isResultMeasureHeader;
import { CatalogDateAttributeGranularity } from "@gooddata/sdk-model";
import { toSdkGranularity } from "../toSdkModel/dateGranularityConversions";
import { DateValueFormatter } from "../dateFormatting/dateValueFormatter";

export type TransformerResult = {
    readonly headerItems: IResultHeader[][][];
    readonly data: DataValue[][] | DataValue[];
    readonly offset: number[];
    readonly count: number[];
    readonly total: number[];
};

// gets all the enum values
const supportedSuffixes: string[] = Object.keys(AttributeGranularityResourceAttribute)
    .filter(item => isNaN(Number(item)))
    .map(
        key =>
            AttributeGranularityResourceAttribute[key as keyof typeof AttributeGranularityResourceAttribute],
    );

function getGranularity(header: IDimensionItemDescriptor): CatalogDateAttributeGranularity | undefined {
    if (!isAttributeDescriptor(header)) {
        return undefined;
    }

    const { identifier } = header.attributeHeader.formOf;
    const suffix = identifier.substr(identifier.lastIndexOf(".") + 1);

    return supportedSuffixes.includes(suffix)
        ? toSdkGranularity(suffix as AttributeGranularityResourceAttribute)
        : undefined; // not a date attribute
}

function transformHeaderItems(
    dimensions: IDimensionDescriptor[],
    dateValueFormatter: DateValueFormatter,
    dimensionHeaders?: Execution.IDimensionHeader[],
): IResultHeader[][][] {
    if (!dimensionHeaders) {
        return [[[]]];
    }

    return dimensionHeaders.map((dimensionHeader, dimensionIndex) => {
        return dimensionHeader.headerGroups.map((headerGroup, headerGroupIndex) => {
            const granularity = getGranularity(dimensions[dimensionIndex].headers[headerGroupIndex]);
            return headerGroup.headers.map(
                (header): IResultHeader => {
                    if (isResultAttributeHeader(header)) {
                        return {
                            attributeHeaderItem: {
                                uri: `/fake/${header.attributeHeader.labelValue}`,
                                name: granularity
                                    ? dateValueFormatter(header.attributeHeader.labelValue, granularity)
                                    : header.attributeHeader.labelValue,
                            },
                        };
                    }

                    if (isResultMeasureHeader(header)) {
                        return {
                            measureHeaderItem: {
                                name: header.measureHeader.name,
                                order: header.measureHeader.order,
                            },
                        };
                    }

                    return {
                        totalHeaderItem: {
                            name: header.totalHeader.name,
                            type: header.totalHeader.type,
                        },
                    };
                },
            );
        });
    });
}

export function transformExecutionResult(
    result: Execution.IExecutionResult,
    dimensions: IDimensionDescriptor[],
    dateValueFormatter: DateValueFormatter,
): TransformerResult {
    return {
        data: result.data,
        headerItems: transformHeaderItems(dimensions, dateValueFormatter, result.dimensionHeaders),
        offset: result.paging.offset,
        count: result.paging.count,
        total: result.paging.total,
    };
}
