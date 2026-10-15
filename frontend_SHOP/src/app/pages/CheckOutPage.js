import React, { useEffect, useRef, useState } from "react";
import Gap from "../components/Commom/Gap";
import { useForm } from "react-hook-form";
import Input from "../components/Input/Input";
import { Form, Modal, Radio, Select, Space } from "antd";
import Title from "../components/Commom/Title";
import FlexCol from "../components/Commom/FlexCol";
import ProductHozizontal from "../modules/Product/ProductHozizontal";
import PriceProduct from "../modules/Product/parts/PriceProduct";
import {
  ArrowRight,
  BaggageClaim,
  ChevronRight,
  CirclePlus,
  MapPin,
  MapPinned,
  Shirt,
  ShoppingBag,
  WalletMinimal,
} from "lucide-react";
import Button from "../components/Button/Button";
import TextArea2 from "../components/Input/TextArea";
import { getArrayFromLS, saveArrayLS } from "../../utils/localStorage";
import { formatPrice } from "../../utils/functions";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import dataProvince from "../../utils/province.json";
import { handleAddAddressUser } from "../../store/user/handleUser";
import { toast } from "react-toastify";
import {
  handleCreateLinkPayment,
  handleOrderProduct,
} from "../../store/order/handleOrder";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Image from "../components/Image/Image";
import { Epath } from "../routes/routerConfig";
const CheckOutPage = () => {
  const { control, setValue } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [form] = Form?.useForm();
  const [dataCity, setDataCity] = useState(dataProvince.data);
  const [dataDistrict, setDistrict] = useState([]);
  const [dataWards, setWards] = useState([]);
  const [labelCity, setlabelCity] = useState("");
  const [labelDistrict, setLabelDistrict] = useState("");
  const [labelWards, setLabelWards] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
    setIsModalOpen(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const { dataCurrentUser } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.order);
  // ------------------------

  const [addressId, setAddressId] = useState(
    dataCurrentUser?.Addresses?.[0]?.id
  );

  const [PaymentMehodId, setPaymentMehodId] = useState(1);

  // ------------------------

  const [infoAddress, setInfoAddress] = useState(
    dataCurrentUser?.Addresses?.[0]?.address
  );

  // mục đích để khi thêm address lần đầu nó hiện lên luôn
  useEffect(() => {
    if (dataCurrentUser?.Addresses?.[0]?.address) {
      setInfoAddress(dataCurrentUser?.Addresses?.[0]?.address);
    }
    if (dataCurrentUser?.Addresses?.[0]?.id) {
      setAddressId(dataCurrentUser?.Addresses?.[0]?.id);
    }
  }, [dataCurrentUser?.Addresses]);

  // ------------------------

  const splitAddress = infoAddress?.split(",");

  // ------------------------
  const dataProInCheckout = getArrayFromLS("dataProInCheckout");
  const totalMoneyCheckout = dataProInCheckout?.reduce(
    (accumulator, currentValue) =>
      accumulator +
      currentValue.quantity *
        parseFloat(formatPrice(currentValue.price).replace(".", "")),
    0
  );
  // ------------------------

  const handleChangeAddress = (e) => {
    setAddressId(e.target.value);
    const selectedItem = dataCurrentUser.Addresses.find(
      (item) => item.id === e.target.value
    );
    if (selectedItem) {
      setInfoAddress(selectedItem.address);
    }
  };

  const handleChangePaymentMethod = (e) => {
    setPaymentMehodId(e.target.value);

    if (e.target.value === 2) {
    }
  };

  const handlePaymentPayOsForm = () => {
    if (!addressId) {
      toast.error("Vui lòng thêm địa chỉ của bạn !", { autoClose: 800 });
    }

    const dataProInCheckout = getArrayFromLS("dataProInCheckout");

    const dataPro =
      dataProInCheckout.length > 0 &&
      dataProInCheckout.map((product) => ({
        idProductDetails: product.idProductDetails,
        quantity: product.quantity,
        price: product.price,
      }));

    const datatoPaymentPending = {
      addressId: addressId,
      paymentmethoduserId: PaymentMehodId,
      productDetails: dataPro,
      orderState: "1",
    };

    // window.location.port lấy được port hiện tại vd: 3000
    // mới đàu cứ phải cho trạng thái pending
    const data = {
      description: "CHUYEN TIEN CHO MTSHOP",
      amount: totalMoneyCheckout,
      cancelUrl: `http://localhost:${window.location.port}${Epath.paymentError}`,
      returnUrl: `http://localhost:${window.location.port}${Epath.paymentSuccess}`,
      callBack: (checkoutUrl, orderCode) => {
        dispatch(
          handleOrderProduct({
            ...datatoPaymentPending,
            orderId: Number(orderCode),
            callBack: () => {
              window.location.href = checkoutUrl;
            },
          })
        );
      },
    };

    dispatch(handleCreateLinkPayment(data));
  };
  // ------------------------

  useEffect(() => {
    setValue("name", dataCurrentUser?.userName);
    setValue("email", dataCurrentUser?.email);
    setValue("phoneNumber", dataCurrentUser?.phoneNumber);
    setValue("city", splitAddress?.[3] || "");
    setValue("district", splitAddress?.[2] || "");
    setValue("wards", splitAddress?.[1] || "");
    setValue("detailAddress", splitAddress?.[0] || "");
  }, [dataCurrentUser, infoAddress, setValue, splitAddress]);
  // ------------------------

  const handleAddAddressUserForn = (data) => {
    const checkAdetailAddress = data.AdetailAddress.split(",");

    const joinAddress = `${checkAdetailAddress.join(
      " "
    )}, ${labelWards}, ${labelDistrict}, ${labelCity}`;

    dispatch(
      handleAddAddressUser({
        address: joinAddress,
        callBack: () => {
          toast.success("Thêm địa chỉ thành công", { autoClose: 800 });
          setIsModalOpen2(false);
        },
      })
    );
  };

  const handleCityChange = (cityId, { label }) => {
    const selectedCity = dataCity.find((city) => city.id === cityId);
    setDistrict(selectedCity ? selectedCity.data2 : []);
    setlabelCity(label);
    form.resetFields(["district", "wards"]);
    setWards([]);
  };

  const handleDistrictChange = (districtId, { label }) => {
    const selectedProvince = dataDistrict.find(
      (province) => province.id === districtId
    );
    setLabelDistrict(label);
    setWards(selectedProvince ? selectedProvince.data3 : []);
    form.resetFields(["wards"]);
  };

  const handleWardsChange = (_, { label }) => {
    setLabelWards(label);
  };

  const optionCity = dataProvince.data.map((city) => ({
    value: city.id,
    label: city.full_name,
  }));

  const optionDistrict = dataDistrict.map((district) => ({
    value: district.id,
    label: district.full_name,
  }));

  const optionWards = dataWards.map((wards) => ({
    value: wards.id,
    label: wards.full_name,
  }));

  const handleOrderProductForm = () => {
    const dataProInCheckout = getArrayFromLS("dataProInCheckout");

    const dataPro =
      dataProInCheckout.length > 0 &&
      dataProInCheckout.map((product) => ({
        idProductDetails: product.idProductDetails,
        quantity: product.quantity,
        price: product.price,
      }));

    if (!addressId) {
      toast.error("Vui lòng thêm địa chỉ của bạn !", { autoClose: 800 });
    }

    const data = {
      addressId: addressId,
      paymentmethoduserId: PaymentMehodId,
      productDetails: dataPro,
      callBack: () => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Đặt Hàng Thành Công !",
          text: "Cảm ơn quý khách hàng rất nhiều ạ 😍 ",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#70c1b3",
          confirmButtonText: "Về Trang Chủ",
          cancelButtonText: "Tiếp Tục Mua Sắm",
          allowOutsideClick: false,
          // timer: 500,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          } else {
            navigate("/shopping/all");
          }
        });
      },
    };

    dispatch(handleOrderProduct(data));
  };

  return (
    <Form onFinish={handleOrderProductForm}>
      <Modal
        title="Chọn địa chỉ nhận hàng"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <Radio.Group
          defaultValue={
            dataCurrentUser?.Addresses?.length > 0 &&
            dataCurrentUser?.Addresses?.[0]?.id
          }
          onChange={handleChangeAddress}
        >
          <Space direction="vertical">
            {dataCurrentUser?.Addresses?.map((item) => (
              <Radio key={item.id} value={item.id}>
                <p className="ml-8 my-2 text-text1 font-normal text-sm">
                  {item.address}
                </p>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
        <div className="flex items-center justify-end">
          <Button
            className="py-2 px-5 rounded mt-3 "
            onClick={showModal2}
            kind="secondary"
          >
            <CirclePlus />
            <h1 className="ml-2"> Thêm Địa Chỉ</h1>
          </Button>
        </div>
      </Modal>

      <Modal
        title="Địa Chỉ Mới"
        open={isModalOpen2}
        onCancel={handleCancel2}
        footer={false}
        width={600}
      >
        <Form form={form} onFinish={handleAddAddressUserForn}>
          <div className="checkout flex flex-col items-center ">
            <FlexCol title="Thành Phố" className="w-full">
              <Form.Item
                name="city"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Thành Phố !",
                  },
                ]}
              >
                <Select
                  showSearch
                  // className="w-[300px] h-[45px]"
                  className=" w-full h-[45px]"
                  placeholder="Thành Phố của bạn..."
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={handleCityChange}
                  // onSelect={(value, { label }) => console.log("HEHE", label)}
                  options={optionCity}
                />
              </Form.Item>
            </FlexCol>
            <FlexCol title="Quận Huyện" className="w-full">
              <Form.Item
                name="district"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Quận Huyện !",
                  },
                ]}
              >
                <Select
                  showSearch
                  // className="w-[300px] h-[45px]"
                  className=" w-full h-[45px]"
                  placeholder="Quận Huyện của bạn...."
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={handleDistrictChange}
                  options={optionDistrict}
                />
              </Form.Item>
            </FlexCol>

            <FlexCol title="Xã Phường" className="w-full">
              <Form.Item
                name="wards"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Xã Phường !",
                  },
                ]}
              >
                <Select
                  showSearch
                  // className="w-[300px] h-[45px]"
                  className=" w-full h-[45px] !text-emerald-600"
                  placeholder="Xã Phường của bạn"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={handleWardsChange}
                  options={optionWards}
                />
              </Form.Item>
            </FlexCol>

            <FlexCol title="Chi Tiết Địa Chỉ" className="w-full">
              <Form.Item
                name="AdetailAddress"
                rules={[
                  {
                    required: true,
                    message: " Vui Lòng Nhập địa chỉ chi tiết",
                  },
                  // { validator: validateNoComma },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Chi tiết địa chỉ của bạn..."
                  // maxLength={6}
                />
              </Form.Item>
            </FlexCol>
          </div>

          <Button
            className="py-2 px-5 rounded mt-3 w-full "
            type="submit"
            kind="secondary"
          >
            <h1 className="ml-2">Hoàn thành</h1>
          </Button>
        </Form>
      </Modal>
      <Gap>
        <div className="grid grid-cols-7 gap-x-6">
          <div className="col-span-4">
            <div className="flex items-center gap-x-3">
              <MapPin />
              <Title title="Thông Tin Giao Hàng"></Title>
            </div>

            <div className="flex flex-col gap-y-5 mt-5">
              {dataCurrentUser?.Addresses?.length > 0 && (
                <div
                  onClick={showModal}
                  className="flex items-center justify-between cursor-pointer py-3 px-4 rounded-md bg-text2"
                >
                  <div>
                    <div className="flex items-center gap-x-3">
                      <MapPinned />
                      <Title
                        title="Địa chỉ nhận hàng"
                        className="text-[14px] font-normal"
                      >
                        {" "}
                      </Title>
                    </div>
                    <p className="ml-8 my-3 text-text1 font-normal text-sm">
                      {infoAddress}
                    </p>
                  </div>
                  <ChevronRight></ChevronRight>
                </div>
              )}
              <div className="flex flex-col items-center gap-y-3">
                <FlexCol title="Tên " className="w-full">
                  <Input
                    control={control}
                    name="name"
                    placeholder="Tên của bạn..."
                    disabled
                  ></Input>
                </FlexCol>
                <FlexCol title="Email" className="w-full">
                  <Input
                    control={control}
                    name="email"
                    placeholder="Email của bạn..."
                    disabled
                  ></Input>
                </FlexCol>
              </div>
              <FlexCol title="Số Điện Thoại" className="w-full">
                <Input
                  control={control}
                  name="phoneNumber"
                  placeholder="Số điện thoại của bạn..."
                  disabled
                ></Input>
              </FlexCol>
              {dataCurrentUser?.Addresses?.length > 0 ? (
                <div className="checkout flex flex-col items-center gap-y-5">
                  <FlexCol title="Thành Phố" className="w-full">
                    <Input
                      control={control}
                      placeholder="Thành Phố của bạn..."
                      name="city"
                      disabled
                    ></Input>
                  </FlexCol>
                  <FlexCol title="Quận Huyện" className="w-full">
                    <Input
                      control={control}
                      placeholder="Quận Huyện của bạn..."
                      name="district"
                      disabled
                    ></Input>
                  </FlexCol>

                  <FlexCol title="Xã Phường" className="w-full">
                    <Input
                      control={control}
                      placeholder="Xã Phường của bạn..."
                      name="wards"
                      disabled
                    ></Input>
                  </FlexCol>

                  <FlexCol title="Chi Tiết Địa Chỉ" className="w-full">
                    <TextArea2
                      control={control}
                      placeholder="Chi tiết địa chỉ của bạn..."
                      name="detailAddress"
                      disabled
                    ></TextArea2>
                  </FlexCol>
                </div>
              ) : (
                <div className="flex items-center justify-start">
                  <Button
                    className="py-2 px-5 rounded mt-3 "
                    onClick={showModal2}
                    kind="secondary"
                  >
                    <CirclePlus />
                    <h1 className="ml-2"> Thêm Địa Chỉ</h1>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-3 ">
            <div className="border-[1px] border-text3 py-3 px-4 rounded-lg ">
              <div className=" pt-3 pb-5 flex items-center gap-x-3 ">
                <ShoppingBag />

                <Title
                  title="Sản Phẩm"
                  className="text-[24px] font-semibold"
                ></Title>
              </div>
              <div className="flex scroll-hidden flex-col gap-y-3 max-h-[400px] overflow-y-auto">
                {dataProInCheckout?.length > 0 &&
                  dataProInCheckout.map((item, index) => (
                    <ProductHozizontal
                      key={index}
                      totalMoneyCheckout={totalMoneyCheckout}
                      data={item}
                    ></ProductHozizontal>
                  ))}
              </div>

              <div>
                <div className="flex items-center justify-between pt-6  border-b-[3px] border-text2">
                  <Title
                    title="Tổng Tiền"
                    className="text-[17px] font-normal"
                  ></Title>
                  <PriceProduct price={totalMoneyCheckout}></PriceProduct>
                </div>
                <div className="flex items-center justify-between pt-6  border-b-[3px] border-text2">
                  <Title
                    title="Phí Ship"
                    className="text-[17px] font-normal"
                  ></Title>
                  <h1>Miễn Phí</h1>
                </div>
                <div className="flex items-center justify-between pt-6 pb-3 ">
                  <Title
                    title="Tổng Tiền"
                    className="text-[17px] font-normal"
                  ></Title>
                  <PriceProduct price={totalMoneyCheckout}></PriceProduct>
                </div>
              </div>
            </div>
            <div className="border-[1px] border-text3 py-3 px-4 rounded-lg mt-5">
              <div className=" pt-3 pb-5 flex items-center gap-x-3 ">
                <WalletMinimal />

                <Title
                  title="Phương Thức Thanh Toán"
                  className="text-[18px] font-semibold"
                ></Title>
              </div>
              <div>
                <Radio.Group
                  defaultValue={1}
                  value={PaymentMehodId}
                  onChange={handleChangePaymentMethod}
                >
                  <Space direction="vertical">
                    <Radio value={1}>
                      <Title
                        title="Thanh Toán Khi Nhận Hàng"
                        className="text-[16px]"
                      ></Title>
                    </Radio>
                    <Radio value={2}>
                      <Title
                        title="Thanh Toán Online"
                        className="text-[16px]"
                      ></Title>
                    </Radio>
                  </Space>
                </Radio.Group>
                {PaymentMehodId === 2 && (
                  <div>
                    <Image url="/payos-logo.svg"></Image>
                    <h1 className="py-4 text-center text-text3 font-medium">
                      Xử lý giao dịch Thanh toán chuyển khoản Napas 24/7{" "}
                    </h1>
                  </div>
                )}
              </div>
            </div>
            {PaymentMehodId === 1 ? (
              <Button
                type="submit"
                className="py-3 px-4 w-full mt-4 rounded-md hover:scale-105 transition-all"
                kind="primary"
              >
                Đặt Hàng Ngay
              </Button>
            ) : (
              <Button
                className="py-3 px-4 w-full mt-4 rounded-md hover:scale-105 transition-all"
                kind="primary"
                isLoading={loading}
                onClick={handlePaymentPayOsForm}
              >
                Tiến hàng Thanh Toán
              </Button>
            )}
          </div>
        </div>
      </Gap>
    </Form>
  );
};

export default CheckOutPage;
