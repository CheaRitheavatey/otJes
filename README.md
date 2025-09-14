# otJes

sign2sub-project/
├── backend/
│ ├── app/
│ │ ├── **init**.py
│ │ ├── main.py
│ │ ├── models/
│ │ │ ├── **init**.py
│ │ │ └── model_loader.py
│ │ ├── services/
│ │ │ ├── **init**.py
│ │ │ └── prediction_service.py
│ │ ├── utils/
│ │ │ ├── **init**.py
│ │ │ └── image_processor.py
│ │ └── schemas/
│ │ ├── **init**.py
│ │ └── schemas.py
│ ├── requirements.txt
│ ├── model_files/
│ │ ├── model.json
│ │ ├── weights.bin
│ │ └── metadata.json
│ └── Dockerfile
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── services/
│ │ ├── utils/
│ │ └── App.js
│ ├── package.json
│ └── Dockerfile
└── docker-compose.yml
