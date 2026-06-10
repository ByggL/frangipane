import json
import re

def clean_json(data):
    if isinstance(data, dict):
        # remove custom_fields key
        data.pop("custom_fields", None)
        data.pop("custom_field_values", None)
        data.pop("url", None)
        data.pop("slug", None)
        data.pop("lang", None)
        data.pop("hits", None)
        data.pop("featured", None)
        data.pop("access", None)
        data.pop("catid", None)

        if "thumbnail" in data and isinstance(data["thumbnail"], str):
            thumbnail_url = "https://www.thesmackdownhotel.com/" + data["thumbnail"]
            data["thumbnail"] = thumbnail_url
        
        # process attr fields
        if "attr" in data and isinstance(data["attr"], dict):
            keys_to_delete = []
            new_items = {}
            
            for key, val in data["attr"].items():
                # match ct followed by 1 to 999
                if re.match(r'^ct([1-9]|[1-9]\d|[1-9]\d{2})$', key) and isinstance(val, dict):
                    titles = val.get("title")
                    front_vals = val.get("frontend_value")

                    
                    # extract first elements if arrays are valid
                    if isinstance(titles, list) and titles and front_vals:
                        if isinstance(front_vals, list):
                            if len(front_vals) > 1:
                                new_items[str(titles[0])] = front_vals
                            else:
                                new_items[str(titles[0])] = front_vals[0]
                        else:
                            new_items[str(titles[0])] = front_vals
                        keys_to_delete.append(key)
            
            # replace original ctXXX objects with extracted key-value pairs
            for k in keys_to_delete:
                del data["attr"][k]
            data["attr"].update(new_items)
            
        # recurse over remaining dictionary values
        for val in data.values():
            clean_json(val)
            
    elif isinstance(data, list):
        # recurse over list items
        for item in data:
            clean_json(item)
            
    return data

def process_file(input_path, output_path):
    # load, process, save
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    cleaned_data = clean_json(data)
    
    # Filter data: only wrestlers from WWE, AEW, NJPW, or TNA
    filtered_data = {}
    target_promotions = {"WWE", "AEW", "NJPW"}
    
    for key, item in cleaned_data.items():
        if not isinstance(item, dict):
            continue
            
        attr = item.get("attr", {})
        all_promos = attr.get("All-Time Promotions", [])
        
        # Normalize to list
        if isinstance(all_promos, str):
            all_promos = [all_promos]
        elif not isinstance(all_promos, list):
            all_promos = []
            
        # Check if any target promotion is in the list
        if any(str(p).upper() in target_promotions for p in all_promos):
            filtered_data[key] = item

    print(f"Filtered from {len(cleaned_data)} to {len(filtered_data)} items.")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_data, f, indent=4)

# usage example
if __name__ == "__main__":
    process_file("data/input.json", "data/output.json")
