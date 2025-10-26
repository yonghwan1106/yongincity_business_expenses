#!/usr/bin/env python3
"""
Google Sheets에서 비목이 비어있는 10번 행을 '기관'으로 수정하는 스크립트
"""

import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

# .env.local 파일 로드
load_dotenv('.env.local')

# 환경 변수에서 읽기
SPREADSHEET_ID = os.getenv('GOOGLE_SPREADSHEET_ID')
CLIENT_EMAIL = os.getenv('GOOGLE_CLIENT_EMAIL')
PRIVATE_KEY = os.getenv('GOOGLE_PRIVATE_KEY').replace('\\n', '\n')

# 인증 설정
credentials = service_account.Credentials.from_service_account_info(
    {
        "type": "service_account",
        "project_id": "용인시-업무추진비",
        "private_key_id": "key-id",
        "private_key": PRIVATE_KEY,
        "client_email": CLIENT_EMAIL,
        "client_id": "000000000000000000000",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{CLIENT_EMAIL}"
    },
    scopes=['https://www.googleapis.com/auth/spreadsheets']
)

# Google Sheets API 클라이언트 생성
service = build('sheets', 'v4', credentials=credentials)

# 10번 행의 비목(I열) 확인 (헤더가 1행이므로 10번 데이터는 11행)
range_name = 'Sheet1!I11'

# 현재 값 읽기
result = service.spreadsheets().values().get(
    spreadsheetId=SPREADSHEET_ID,
    range=range_name
).execute()

current_value = result.get('values', [['']])[0][0] if result.get('values') else ''
print(f"현재 10번 행의 비목: '{current_value}'")

if current_value == '' or current_value is None:
    # 비목을 '기관'으로 업데이트
    body = {
        'values': [['기관']]
    }

    result = service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name,
        valueInputOption='RAW',
        body=body
    ).execute()

    print(f"✅ 10번 행의 비목을 '기관'으로 수정했습니다.")
    print(f"업데이트된 셀 수: {result.get('updatedCells')}")
else:
    print(f"10번 행의 비목이 이미 설정되어 있습니다: '{current_value}'")
