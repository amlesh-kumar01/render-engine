export const godPayload = {
  "document_id": "rep_1027",
  "references": {
    "ref_1": { "source_page": 1, "bounding_boxes": [[0.1, 0.2, 0.5, 0.3]] },
    "ref_2": { "source_page": 2, "bounding_boxes": [[0.2, 0.4, 0.8, 0.5]] }
  },
  "blocks": [
    {
      "id": "blk_001",
      "type": "HEADING",
      "level": 1,
      "alignment": "center",
      "marginBottom": "24px",
      "spans": [
        { "text": "EXECUTIVE SUMMARY", "bold": true, "fontSize": "18px" }
      ]
    },
    {
      "id": "blk_002",
      "type": "TOC",
      "marginBottom": "32px",
      "entries": [
        { "id": "toc_1", "title": "MECHANISM of ACUTE PRESENTATION", "page_number": 34, "level": 0 },
        { "id": "toc_2", "title": "Collision Kinematics", "page_number": 34, "level": 1 }
      ]
    },
    {
      "id": "blk_003",
      "type": "DIVIDER",
      "thickness": "2px",
      "marginBottom": "16px"
    },
    {
      "id": "blk_004",
      "type": "PARAGRAPH",
      "refs": ["ref_1"],
      "marginBottom": "16px",
      "spans": [
        { "text": "The patient exhibits severe oculomotor dysfunction. " },
        { "text": "Confirmed by Dr. Kadet", "italic": true, "refs": ["ref_2"] },
        { "text": ", resulting in a 2nd-grade reading level." }
      ]
    },
    {
      "id": "blk_005",
      "type": "LIST",
      "list_type": "bullet",
      "items": [
        {
          "id": "item_1",
          "level": 0,
          "refs": ["ref_1"],
          "spans": [{ "text": "Right Upper Extremity Weakness", "bold": true }]
        },
        {
          "id": "item_2",
          "level": 1,
          "spans": [{ "text": "Confirmed via Scalene Motor Block" }]
        }
      ]
    }
  ]
};
