import NetInfo from "@react-native-community/netinfo";
import TcpSocket from "react-native-tcp-socket";
import DataModal from "../../components/data/DataModal";

let CMD = DataModal;

const printerIP = "192.168.1.126";
const printerPort = 9100;

export const connectToPrinter = (
  setPrinterConnected,
  setConnectionMessage,
  setErrorMessage,
  printCallback,
  orderData,
  printSuccess = () => {}
) => {
  NetInfo.fetch().then((state) => {
    setErrorMessage("");
    setConnectionMessage("Connecting...");
    if (state.isConnected) {
      const socket = TcpSocket.createConnection({
        host: orderData?.data?.[0]?.printerName || printerIP,
        port: printerPort,
        timeout: 5000,
      });
      socket.on("connect", () => {
        socket.write("\x1b\x40");
        setPrinterConnected(true);
        setConnectionMessage("Connected to printer");

        const dateTime = new Date().toLocaleString();

        const calculateTotalItemCount = () => {
          return orderData?.data?.reduce((total, item) => total + item?.qty, 0);
        };

        const itemCountPaddingSpaces =
          orderData?.data?.length.toString().length !== 2
            ? calculateTotalItemCount().toString().length !== 2
              ? " ".repeat(4)
              : " ".repeat(3)
            : calculateTotalItemCount().toString().length !== 2
            ? " ".repeat(3)
            : " ".repeat(2);

        socket.write("\x1b\x40"); //initialize
        // socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_CT);
        // socket.write(CMD.TEXT_FORMAT.TXT_BOLD_ON);
        // socket.write(CMD.TEXT_FORMAT.TXT_4SQUARE);
        // socket.write(restaurantname);
        // socket.write(CMD.TEXT_FORMAT.TXT_BOLD_OFF);
        // socket.write("\x0a\x0a\x0a");

        socket.write(CMD.TEXT_FORMAT.TXT_FONT_A);
        socket.write(CMD.TEXT_FORMAT.TXT_NORMAL);
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Attender: " + orderData?.data?.[0]?.waiter);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Section: " + orderData?.data?.[0]?.sectionName);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Table: " + orderData?.data?.[0]?.tableName);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Date & Time: " + dateTime);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("Order No: " + orderData?.data?.[0]?.orderNo);
        socket.write("\x0a");
        socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        socket.write("KOT No: " + orderData?.data?.[0]?.kotno);
        socket.write("\x0a");

        // socket.write(CMD.TEXT_FORMAT.TXT_ALIGN_LT);
        // socket.write("Products");
        // socket.write("\x0a");
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

        orderData?.data?.forEach((product, index) => {
          const { itemName, unit, description, qty } = product;
          const slnoLength = (index + 1).length;
          const productNameLength = itemName.length;
          const quantityLength = qty.length;

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
              ? itemName + ` (${unit})` + " ".repeat(paddingSpaces)
              : itemName.slice(0, 24) + ` (${unit})`;

          const paddedQuantity =
            quantityLength < 5
              ? " ".repeat(Math.floor(quantityPaddingSpaces)) + qty.toString()
              : qty.toString();

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
        socket.write(`${orderData?.data?.length}`);
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

        socket.write("\x1D\x56\x42\x00"); //Cut paper

        setTimeout(() => {
          socket.end();
          printSuccess();
          printCallback(true);
        }, 2000);
      });
      socket.on("error", (error) => {
        setErrorMessage("Error connecting to printer: " + error);
        console.log("Error connecting to printer:", error);
        printCallback(false);
      });
      socket.on("close", () => {
        setPrinterConnected(false);
        setConnectionMessage("Not connected to printer");
        console.log("Connection to printer closed");
      });
    } else {
      setErrorMessage("No internet connection");
      printCallback(false);
      console.log("No internet connection");
    }
  });
};
