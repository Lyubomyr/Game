require 'spec_helper'

describe "games/new" do
  before(:each) do
    assign(:game, stub_model(Game,
      :details_id => 1,
      :width => 1,
      :height => 1,
      :colors => 1
    ).as_new_record)
  end

  it "renders new game form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", games_path, "post" do
      assert_select "input#game_details_id[name=?]", "game[details_id]"
      assert_select "input#game_width[name=?]", "game[width]"
      assert_select "input#game_height[name=?]", "game[height]"
      assert_select "input#game_colors[name=?]", "game[colors]"
    end
  end
end
