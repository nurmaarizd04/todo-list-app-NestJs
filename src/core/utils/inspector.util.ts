import { Logger } from "@nestjs/common";
import * as util from "node:util";
import { checkStringIsAvailable } from "./helper.util";

/**
 * This class is useful when you want to inspect request body value
 * that already parsed by exposed `plainToInstance` Function
 */
export class InspectorUtil {
        private readonly tag: string = InspectorUtil.name;
        private logger: Logger;

        constructor(tag: string | undefined = undefined) {
                if (checkStringIsAvailable(tag)) {
                        this.tag = tag ?? InspectorUtil.name;
                }

                this.logger = new Logger(this.tag);
        }

        inspectClass<T>(value: T) {
                this.logger.verbose(
                        `Inspecting ${typeof value} value`,
                        util.inspect(value, { depth: null, colors: true })
                );
        }
}
