"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@workspace/ui/components/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Calendar } from "@workspace/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger, } from "@workspace/ui/components/popover";
import { format } from "date-fns";
import { User, Phone, MapPin, FileText, DollarSign, Calendar as CalendarIcon, Clock, Settings, AlertTriangle, Check, UserCheck, RefreshCw, Trash2, CalendarDays, } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import { API } from "@shared/constants/constants";
const CuratorOrderDetailsClient = ({ initialOrder, masters, }) => {
    const [order, setOrder] = useState(initialOrder);
    const [isAssignMasterOpen, setIsAssignMasterOpen] = useState(false);
    const [isTransferToWarrantyOpen, setIsTransferToWarrantyOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isCompleteOrderOpen, setIsCompleteOrderOpen] = useState(false);
    const [isDeleteOrderOpen, setIsDeleteOrderOpen] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState("");
    const [warrantyMaster, setWarrantyMaster] = useState("");
    const [scheduledDate, setScheduledDate] = useState();
    const [completionNotes, setCompletionNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("kk-KZ", {
            style: "currency",
            currency: "KZT",
        }).format(amount);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("kk-KZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "assigned":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
                return "bg-purple-100 text-purple-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "warranty":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const getStatusText = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "В ожидании";
            case "assigned":
                return "Назначен";
            case "in_progress":
                return "В работе";
            case "completed":
                return "Завершен";
            case "cancelled":
                return "Отменен";
            case "warranty":
                return "Гарантия";
            default:
                return status;
        }
    };
    const canAssignMaster = ["pending", "assigned"].includes(order.status.toLowerCase());
    const canRemoveMaster = order.assigned_master && ["assigned", "in_progress"].includes(order.status.toLowerCase());
    const canTransferToWarranty = order.status.toLowerCase() === "completed";
    const canSchedule = ["assigned", "in_progress"].includes(order.status.toLowerCase());
    const canComplete = ["assigned", "in_progress"].includes(order.status.toLowerCase());
    const canDelete = ["pending", "cancelled"].includes(order.status.toLowerCase());
    const handleAssignMaster = async () => {
        if (!selectedMaster) {
            toast.error("Пожалуйста, выберите мастера");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/assign/${order.id}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify({
                    master_id: parseInt(selectedMaster),
                }),
            });
            if (!response.ok) {
                throw new Error("Ошибка назначения мастера");
            }
            // Обновляем данные заказа
            const updatedOrderResponse = await fetch(`${API}/api/orders/${order.id}/detail/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            if (updatedOrderResponse.ok) {
                const updatedOrder = await updatedOrderResponse.json();
                setOrder(updatedOrder);
            }
            setIsAssignMasterOpen(false);
            setSelectedMaster("");
            toast.success("Мастер успешно назначен");
        }
        catch (error) {
            console.error("Error assigning master:", error);
            toast.error("Ошибка назначения мастера");
        }
        finally {
            setLoading(false);
        }
    };
    const handleRemoveMaster = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/assign/${order.id}/remove/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Ошибка снятия мастера");
            }
            // Обновляем данные заказа
            const updatedOrderResponse = await fetch(`${API}/api/orders/${order.id}/detail/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            if (updatedOrderResponse.ok) {
                const updatedOrder = await updatedOrderResponse.json();
                setOrder(updatedOrder);
            }
            toast.success("Мастер успешно снят с заказа");
        }
        catch (error) {
            console.error("Error removing master:", error);
            toast.error("Ошибка снятия мастера");
        }
        finally {
            setLoading(false);
        }
    };
    const handleTransferToWarranty = async () => {
        if (!warrantyMaster) {
            toast.error("Пожалуйста, выберите мастера для гарантии");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/orders/${order.id}/transfer/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify({
                    warranty_master_id: parseInt(warrantyMaster),
                }),
            });
            if (!response.ok) {
                throw new Error("Ошибка передачи на гарантию");
            }
            // Обновляем данные заказа
            const updatedOrderResponse = await fetch(`${API}/api/orders/${order.id}/detail/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            if (updatedOrderResponse.ok) {
                const updatedOrder = await updatedOrderResponse.json();
                setOrder(updatedOrder);
            }
            setIsTransferToWarrantyOpen(false);
            setWarrantyMaster("");
            toast.success("Заказ передан на гарантийное обслуживание");
        }
        catch (error) {
            console.error("Error transferring to warranty:", error);
            toast.error("Ошибка передачи на гарантию");
        }
        finally {
            setLoading(false);
        }
    };
    const handleScheduleOrder = async () => {
        if (!scheduledDate) {
            toast.error("Пожалуйста, выберите дату");
            return;
        }
        setLoading(true);
        try {
            toast.info("Функция планирования будет реализована позже");
            setIsScheduleOpen(false);
            setScheduledDate(undefined);
        }
        catch (error) {
            console.error("Error scheduling order:", error);
            toast.error("Ошибка планирования заказа");
        }
        finally {
            setLoading(false);
        }
    };
    const handleCompleteOrder = async () => {
        setLoading(true);
        try {
            toast.info("Функция завершения заказа будет реализована позже");
            setIsCompleteOrderOpen(false);
            setCompletionNotes("");
        }
        catch (error) {
            console.error("Error completing order:", error);
            toast.error("Ошибка завершения заказа");
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteOrder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/orders/${order.id}/delete/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Ошибка удаления заказа");
            }
            toast.success("Заказ успешно удален");
            // Redirect to orders list
            window.location.href = "/orders";
        }
        catch (error) {
            console.error("Error deleting order:", error);
            toast.error("Ошибка удаления заказа");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Детали заказа #{order.id}</h1>
        <Badge className={getStatusColor(order.status)}>
          {getStatusText(order.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5"/>
              Информация о клиенте
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground"/>
              <span className="font-medium">Имя:</span>
              <span>{order.client_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground"/>
              <span className="font-medium">Телефон:</span>
              <span>{order.client_phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1"/>
              <span className="font-medium">Адрес:</span>
              <span className="flex-1">{order.address}</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5"/>
              Информация о заказе
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground"/>
              <span className="font-medium">Цена:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(order.price)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground"/>
              <span className="font-medium">Создан:</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            {order.scheduled_date && (<div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground"/>
                <span className="font-medium">Запланирован:</span>
                <span>{formatDate(order.scheduled_date)}</span>
              </div>)}
            {order.completion_date && (<div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground"/>
                <span className="font-medium">Завершен:</span>
                <span>{formatDate(order.completion_date)}</span>
              </div>)}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5"/>
              Описание работ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{order.description}</p>
          </CardContent>
        </Card>

        {/* Master Information */}
        {(order.assigned_master || order.master_name) && (<Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5"/>
                Назначенный мастер
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground"/>
                <span className="font-medium">Имя:</span>
                <span>{order.assigned_master?.name || order.master_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground"/>
                <span className="font-medium">Телефон:</span>
                <span>{order.assigned_master?.phone || order.master_phone}</span>
              </div>
            </CardContent>
          </Card>)}

        {/* Notes */}
        {order.notes && (<Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5"/>
                Примечания
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{order.notes}</p>
            </CardContent>
          </Card>)}
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5"/>
            Действия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {canAssignMaster && (<Button onClick={() => setIsAssignMasterOpen(true)} className="flex items-center gap-2">
                <UserCheck className="h-4 w-4"/>
                {order.assigned_master ? "Изменить мастера" : "Назначить мастера"}
              </Button>)}

            {canRemoveMaster && (<Button variant="outline" onClick={handleRemoveMaster} className="flex items-center gap-2" disabled={loading}>
                <RefreshCw className="h-4 w-4"/>
                Снять мастера
              </Button>)}

            {canSchedule && (<Button variant="outline" onClick={() => setIsScheduleOpen(true)} className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4"/>
                Запланировать
              </Button>)}

            {canComplete && (<Button variant="outline" onClick={() => setIsCompleteOrderOpen(true)} className="flex items-center gap-2">
                <Check className="h-4 w-4"/>
                Завершить заказ
              </Button>)}

            {canTransferToWarranty && (<Button variant="outline" onClick={() => setIsTransferToWarrantyOpen(true)} className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4"/>
                Передать на гарантию
              </Button>)}

            {canDelete && (<Button variant="destructive" onClick={() => setIsDeleteOrderOpen(true)} className="flex items-center gap-2">
                <Trash2 className="h-4 w-4"/>
                Удалить заказ
              </Button>)}
          </div>
        </CardContent>
      </Card>

      {/* Assign Master Dialog */}
      <Dialog open={isAssignMasterOpen} onOpenChange={setIsAssignMasterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Назначить мастера</DialogTitle>
            <DialogDescription>
              Выберите мастера для выполнения этого заказа.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="master">Мастер</Label>
              <Select value={selectedMaster} onValueChange={setSelectedMaster}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите мастера"/>
                </SelectTrigger>
                <SelectContent>
                  {masters.map((master) => (<SelectItem key={master.id} value={master.id.toString()}>
                      {master.name} - {master.phone}
                      {master.specialization && ` (${master.specialization})`}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignMasterOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAssignMaster} disabled={loading}>
              {loading ? "Назначение..." : "Назначить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer to Warranty Dialog */}
      <Dialog open={isTransferToWarrantyOpen} onOpenChange={setIsTransferToWarrantyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Передать на гарантию</DialogTitle>
            <DialogDescription>
              Выберите мастера для гарантийного обслуживания.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="warranty-master">Гарантийный мастер</Label>
              <Select value={warrantyMaster} onValueChange={setWarrantyMaster}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите мастера"/>
                </SelectTrigger>
                <SelectContent>
                  {masters.map((master) => (<SelectItem key={master.id} value={master.id.toString()}>
                      {master.name} - {master.phone}
                      {master.specialization && ` (${master.specialization})`}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferToWarrantyOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleTransferToWarranty} disabled={loading}>
              {loading ? "Передача..." : "Передать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Order Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Запланировать заказ</DialogTitle>
            <DialogDescription>
              Выберите дату и время для выполнения заказа.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Дата и время</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !scheduledDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {scheduledDate ? (format(scheduledDate, "PPP")) : (<span>Выберите дату</span>)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus/>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleScheduleOrder} disabled={loading}>
              {loading ? "Планирование..." : "Запланировать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Order Dialog */}
      <Dialog open={isCompleteOrderOpen} onOpenChange={setIsCompleteOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Завершить заказ</DialogTitle>
            <DialogDescription>
              Добавьте примечания о завершении заказа (опционально).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="completion-notes">Примечания о завершении</Label>
              <Textarea id="completion-notes" value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} placeholder="Дополнительная информация о выполненной работе..." rows={4}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteOrderOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCompleteOrder} disabled={loading}>
              {loading ? "Завершение..." : "Завершить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Order Dialog */}
      <Dialog open={isDeleteOrderOpen} onOpenChange={setIsDeleteOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить заказ</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот заказ? Это действие нельзя
              отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOrderOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrder} disabled={loading}>
              {loading ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
};
export default CuratorOrderDetailsClient;
