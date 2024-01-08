import account from "./account";
import hr from "./hr";
import logistic from "./logistic";
import { commonStore } from "@/store/common";

// export default {
//   setup() {
//     // Watch for changes in the commonStore().menu
//     watch(commonStore().menu, () => {
//       if (commonStore().menu === '인사') return [...hr] as VerticalNavItems;
//       else if (commonStore().menu === '물류') return [...logistic] as VerticalNavItems;
//       else return [...account] as VerticalNavItems;
//     });
//   },
// };

export default [...account] as VerticalNavItems;
