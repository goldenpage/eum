import { useState } from "react";
import Button from "./Button";
import type { SalesRecord } from "../features/sales/api";
import Input from "./Input";

interface SalesEditModalProps {
    record: SalesRecord | null;
    onClose: () => void;
    onSave: (
        saleId: string, 
        saleMenuCount: number,
        payment: string
    ) => Promise<void>;
}

export function SalesEditModal({ record, onClose, onSave}: SalesEditModalProps){
    if(!record){
        return null;
    }
    
    return (
        <SalesEditModalContent
            record = {record}
            onClose = {onClose}
            onSave = {onSave}
        />
    );
}

function SalesEditModalContent({ record, onClose, onSave}: {
    record: SalesRecord;
    onClose: () => void;
    onSave: (
        saleId: string,
        saleMenuCount: number,
        payment: string
    ) => Promise<void>;
}){
    const [qty, setQty] = useState(String(record.qty));
    const [payment, setPayment] = useState(record.paymentMethod ?? "");

    return (
        <div className="sales-modal-backdrop">
            <div className="sales-modal">
                <h3>판매 기록 수정</h3>
                    <label>
                        메뉴명
                        <input type="text" value={record.menuName ?? ""} readOnly/>
                    </label>
                        <Input
                            text="수량"
                            inputType="number"
                            value={qty}
                            onChange={setQty}
                            min={1}
                        />
                        <Input
                            text="결제수단"
                            inputType="text"
                            value={payment}
                            onChange={setPayment}
                        />
                    <div className="sales-modal-actions">
                        <Button type="button" onClick={() => onSave(record.saleId, Number(qty), payment)}>저장</Button>
                        <Button type="button" onClick={onClose}>취소</Button>
                    </div>
            </div>
        </div>
    );
}