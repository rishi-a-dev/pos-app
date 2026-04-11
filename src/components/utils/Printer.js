import TcpSocket from "react-native-tcp-socket";
import DataModal from "../../components/data/DataModal";

let CMD = DataModal;

const printerPort = 9100;
const DEFAULT_PRINTER_IP = "192.168.1.126";

/**
 * Print KOT items to a single printer.
 * Dashboard is responsible for connection check + grouping + retries.
 */
export const printToPrinter = ({
  printerIp,
  orderItems,
  printCallback,
  timeoutMs = 5000,
}) => {
  const products = Array.isArray(orderItems) ? orderItems : [];
  const headerItem = products?.[0] ?? {};
  const host = printerIp || headerItem?.printerIp || DEFAULT_PRINTER_IP;
  return new Promise((resolve, reject) => {
    let settled = false;
    let printingFinishing = false;

    const safeResolve = (ok) => {
      if (settled) return;
      settled = true;
      try {
        printCallback?.(ok);
      } catch (e) {
        // ignore callback errors
      }
      resolve(ok);
    };

    const safeReject = (err) => {
      if (settled) return;
      settled = true;
      try {
        printCallback?.(false);
      } catch (e) {
        // ignore callback errors
      }
      reject(err);
    };

    if (!host) {
      safeReject(new Error("Missing printerIp/host"));
      return;
    }

    const socket = TcpSocket.createConnection({
      host,
      port: printerPort,
      timeout: timeoutMs,
    });

    socket.on("connect", () => {
      try {
        socket.write("\x1b\x40");

        const dateTime = new Date().toLocaleString();

        const calculateTotalItemCount = () => {
          return products.reduce(
            (total, item) => total + Number(item?.qty ?? 0),
            0,
          );
        };

        const itemCountPaddingSpaces = (() => {
          const digits = calculateTotalItemCount().toString().length;
          if (digits !== 2) return " ".repeat(4);
          return " ".repeat(3);
        })();

        socket.write("\x1b\x40"); // initialize

        socket.write(CMD.TEXT_FORMAT.TXT_FONT_A);
        socket.write(CMD.TEXT_FORMAT.TXT_NORMAL);
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Attender: " + headerItem?.waiter);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Section: " + headerItem?.sectionName);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Table: " + headerItem?.tableName);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Date & Time: " + dateTime);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Order No: " + headerItem?.orderNo);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("KOT No: " + headerItem?.kotno);
        socket.write("\x0a");

        socket.write("-----------------------------------------------");
        socket.write("\x0a");

        socket.write("slno");

        socket.write(CMD.FEED_CONTROL_SEQUENCES.CTL_HT);
        socket.write(CMD.FEED_CONTROL_SEQUENCES.CTL_HT);

        socket.write("productname");

        socket.write(CMD.FEED_CONTROL_SEQUENCES.CTL_HT);
        socket.write(CMD.FEED_CONTROL_SEQUENCES.CTL_HT);

        socket.write("quantity");

        socket.write("\x0a");
        socket.write("-----------------------------------------------");
        socket.write("\x0a\x0a");

        products.forEach((product, index) => {
          const { itemName, unit, description, qty } = product;
          const slnoLength = (index + 1).length;
          const productNameLength = (itemName ?? "").length;
          const qtyStr = (qty ?? 0).toString();
          const quantityLength = qtyStr.length;

          const slnoPaddingSpaces =
            slnoLength !== 2 ? Math.max(0, 2 - slnoLength) : 0;
          const paddingSpaces =
            productNameLength < 24 ? Math.floor(24 - productNameLength) : 0;
          const quantityPaddingSpaces =
            quantityLength !== 5 ? Math.max(0, 5 - quantityLength) : 0;
          const hasInstructions = description?.length > 0;

          const paddedSlno =
            slnoLength !== 2
              ? index + 1 + " ".repeat(2 - slnoLength - slnoPaddingSpaces)
              : index + 1;

          const paddedProductname =
            productNameLength < 24
              ? (itemName ?? "") + ` (${unit})` + " ".repeat(paddingSpaces)
              : (itemName ?? "").slice(0, 24) + ` (${unit})`;

          const paddedQuantity =
            quantityLength < 5
              ? " ".repeat(Math.floor(quantityPaddingSpaces)) + qtyStr
              : qtyStr;

          socket.write(CMD.TEXT_FORMAT.TXT_FONT_A);
          socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
          socket.write(paddedSlno);
          socket.write(CMD.FEED_CONTROL_SEQUENCES.CTL_HT);
          socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_CT);
          socket.write(paddedProductname);
          socket.write(CMD.FEED_CONTROL_SEQUENCES.CTL_HT);
          socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_RT);
          socket.write(paddedQuantity);
          socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
          socket.write("\x0a");
          socket.write(CMD.TEXT_FORMAT.TXT_FONT_B);
          if (hasInstructions) {
            socket.write("\x0a");
            socket.write("instructions : " + description);
            socket.write("\x0a");
            socket.write(CMD.TEXT_FORMAT.TXT_FONT_A);
            socket.write("-----------------------------------------------");
            socket.write("\x0a\x0a");
          } else {
            socket.write("\x0a");
          }
        });

        socket.write(CMD.TEXT_FORMAT.TXT_FONT_A);
        socket.write("-----------------------------------------------");
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_FONT_A);
        socket.write(CMD.TEXT_FORMAT.TXT_BOLD_ON);
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Total Items: ");
        socket.write(CMD.TEXT_FORMAT.TXT_BOLD_OFF);
        socket.write(CMD.TEXT_FORMAT.TXT_BOLD_ON);
        socket.write(CMD.TEXT_FORMAT.TXT_4SQUARE);
        socket.write(`${products.length}`);
        socket.write(CMD.TEXT_FORMAT.TXT_BOLD_OFF);
        socket.write(CMD.TEXT_FORMAT.TXT_NORMAL);
        socket.write(CMD.TEXT_FORMAT.TXT_FONT_A);
        socket.write(CMD.FEED_CONTROL_SEQUENCES.CTL_HT);
        socket.write(itemCountPaddingSpaces);
        socket.write(CMD.FEED_CONTROL_SEQUENCES.CTL_HT);
        socket.write(CMD.FEED_CONTROL_SEQUENCES.CTL_HT);
        socket.write(CMD.TEXT_FORMAT.TXT_FONT_A);
        socket.write(CMD.TEXT_FORMAT.TXT_BOLD_ON);
        socket.write("Total Qty: ");
        socket.write(CMD.TEXT_FORMAT.TXT_BOLD_OFF);
        socket.write(CMD.TEXT_FORMAT.TXT_BOLD_ON);
        socket.write(CMD.TEXT_FORMAT.TXT_4SQUARE);
        socket.write(`${calculateTotalItemCount()}`);
        socket.write(CMD.TEXT_FORMAT.TXT_BOLD_OFF);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_FONT_A);
        socket.write(CMD.TEXT_FORMAT.TXT_NORMAL);
        socket.write("\x0a"); // Line feed

        socket.write("\n");
        socket.write("\x1D\x56\x42\x00"); // Cut paper

        printingFinishing = true;
        // Delay end so the ESC/POS cut command flushes to the printer buffer.
        setTimeout(() => {
          try {
            socket.end();
          } catch (e) {
            // ignore
          }
          safeResolve(true);
        }, 2000);
      } catch (err) {
        try {
          socket.end();
        } catch (e) {
          // ignore
        }
        safeReject(err);
      }
    });

    socket.on("error", (error) => {
      safeReject(
        new Error(
          "Printer connection/write error: " +
            (error?.message ? String(error.message) : String(error)),
        ),
      );
    });

    socket.on("close", () => {
      // Ignore close if we already ended after printing.
      if (!settled && !printingFinishing) {
        safeReject(new Error("Printer connection closed"));
      }
    });
  });
};
