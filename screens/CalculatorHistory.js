import React from "react";
import { View } from "react-native";
import {GetHistory} from ""

export const ViewHistory = () => {

	const [history, setHistory] = useState([])

	   useEffect(() => {
		setHistory(GetHistory)
    		}, [])

  	return (
   		<View
      		style={{
        	flexDirection: "row",
        	height: 100,
        	padding: 20
      		}}
    	>
      <View style={{ backgroundColor: "red", flex: 0.5 }} />
      { history && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={history}
                        renderItem={renderHistory}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
    </View>
  );
};

export default ViewBoxesWithColorAndText;